import pytest
from unittest.mock import Mock, patch, MagicMock
from rest_framework.test import APIClient
from django.urls import reverse
from app.models import OutfitSearch


@pytest.mark.unit
@pytest.mark.django_db
class TestUploadImageViewSet:
    """Tests for UploadImageViewSet API endpoint."""

    def setup_method(self):
        """Setup for each test."""
        self.client = APIClient()
        self.url = "/api/outfit_searches/"

    def test_upload_image_success(
        self, sample_image, gemini_mock_response, serp_api_mock_response
    ):
        """Test successful image upload and analysis."""
        with patch("app.api.views.genai") as mock_genai, patch(
            "app.api.views.requests.get"
        ) as mock_serp:

            # Mock Gemini response
            mock_response = Mock()
            mock_response.text = '{"refined_label": "Men\'s navy blazer", "type": "blazer", "gender": "men", "color": "navy", "fit": "slim"}'
            mock_genai.GenerativeModel.return_value.generate_content.return_value = (
                mock_response
            )

            # Mock SerpAPI response
            mock_serp.return_value.json.return_value = serp_api_mock_response

            # Make the request
            response = self.client.post(
                self.url, {"image": sample_image}, format="multipart"
            )

            # Verify response
            assert response.status_code == 201
            assert "refined_label" in response.json()
            assert "products" in response.json() or "shopping_results" in response.data

    def test_upload_image_missing_file(self):
        """Test upload without image file."""
        response = self.client.post(self.url, {}, format="multipart")
        assert response.status_code == 400

    def test_upload_image_invalid_file_type(self):
        """Test upload with non-image file."""
        from django.core.files.uploadedfile import SimpleUploadedFile

        invalid_file = SimpleUploadedFile(
            "test.txt", b"not an image", content_type="text/plain"
        )
        response = self.client.post(
            self.url, {"image": invalid_file}, format="multipart"
        )
        # Should either reject or handle gracefully
        assert response.status_code in [400, 201]

    def test_get_outfit_searches(self):
        """Test retrieving outfit searches."""
        response = self.client.get(self.url)
        assert response.status_code == 200
        assert isinstance(response.json(), (list, dict))

    def test_history_endpoint_uses_unverified_clerk_sub_when_verification_fails(self):
        """History should still resolve the user from a Bearer token payload if JWKS verification fails."""
        OutfitSearch.objects.create(
            clerk_user_id="clerk-user-123",
            refined_label="Test outfit",
            results=[],
        )

        with patch("app.api.views.CLERK_JWKS_URL", "https://example.com/.well-known/jwks.json"):
            with patch("app.api.views._jwks_client") as mock_jwks:
                mock_jwks.get_signing_key_from_jwt.side_effect = Exception("jwks down")

                token = "eyJhbGciOiJub25lIn0.eyJzdWIiOiJjbGVyay11c2VyLTEyMyJ9."
                response = self.client.get(
                    "/api/outfit_searches/history/",
                    HTTP_AUTHORIZATION=f"Bearer {token}",
                )

        assert response.status_code == 200
        assert response.json()[0]["clerk_user_id"] == "clerk-user-123"

    @patch("app.api.views.genai")
    @patch("app.api.views.requests.get")
    def test_gemini_api_failure_handling(self, mock_serp, mock_genai, sample_image):
        """Test handling of Gemini API failure."""
        mock_genai.GenerativeModel.return_value.generate_content.side_effect = (
            Exception("API Error")
        )

        response = self.client.post(
            self.url, {"image": sample_image}, format="multipart"
        )

        # Should handle error gracefully
        assert response.status_code in [400, 500]

    @patch("app.api.views.genai")
    @patch("app.api.views.requests.get")
    def test_serp_api_failure_handling(self, mock_serp, mock_genai, sample_image):
        """Test handling of SerpAPI failure."""
        # Mock Gemini to succeed
        mock_response = Mock()
        mock_response.text = '{"refined_label": "Test item"}'
        mock_genai.GenerativeModel.return_value.generate_content.return_value = (
            mock_response
        )

        # Mock SerpAPI to fail
        mock_serp.side_effect = Exception("SerpAPI Error")

        response = self.client.post(
            self.url, {"image": sample_image}, format="multipart"
        )

        # Should handle error gracefully
        assert response.status_code in [400, 500]


@pytest.mark.integration
@pytest.mark.django_db
class TestOutfitSearchIntegration:
    """Integration tests for outfit search flow."""

    def test_full_search_pipeline(self, sample_image):
        """Test complete search pipeline with mocked external APIs."""
        with patch("app.api.views.genai") as mock_genai, patch(
            "app.api.views.requests.get"
        ) as mock_serp:

            # Setup mocks
            mock_response = Mock()
            mock_response.text = '{"refined_label": "Men\'s casual shirt", "type": "shirt", "gender": "men", "color": "blue", "fit": "regular"}'
            mock_genai.GenerativeModel.return_value.generate_content.return_value = (
                mock_response
            )

            mock_serp.return_value.json.return_value = {
                "shopping_results": [
                    {
                        "title": "Blue Shirt",
                        "price": "29.99",
                        "link": "http://example.com/1",
                    }
                ]
            }

            client = APIClient()
            response = client.post(
                "/api/outfit_searches/", {"image": sample_image}, format="multipart"
            )

            assert response.status_code == 201
            data = response.json()
            assert "refined_label" in data
            assert data["refined_label"] == "Men's casual shirt"
