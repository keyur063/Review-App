document.addEventListener('DOMContentLoaded', () => {
    const reviewInput = document.getElementById('review-input');
    const submitReview = document.getElementById('submit-review');
    const reviewList = document.getElementById('review-list');

    const editModal = document.getElementById('edit-modal');
    const editInput = document.getElementById('edit-input');
    const saveEdit = document.getElementById('save-edit');
    let currentReviewId;

    function fetchReviews() {
        fetch('/reviews')
            .then(response => response.json())
            .then(reviews => {
                reviewList.innerHTML = '';
                reviews.forEach(review => {
                    const reviewDiv = document.createElement('div');
                    reviewDiv.textContent = review.content;

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.classList.add('edit-button');  // Added class for styling
                    editButton.addEventListener('click', () => openEditModal(review.id, review.content));

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-button');  // Added class for styling
                    deleteButton.addEventListener('click', () => deleteReview(review.id));

                    const buttonGroup = document.createElement('div');
                    buttonGroup.classList.add('button-group'); // Wrapper for the buttons
                    buttonGroup.appendChild(editButton);
                    buttonGroup.appendChild(deleteButton);

                    reviewDiv.appendChild(buttonGroup);
                    reviewList.appendChild(reviewDiv);
                });
            });
    }

    function addReview(content) {
        fetch('/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        }).then(fetchReviews);
    }

    function deleteReview(id) {
        fetch('/reviews', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        }).then(fetchReviews);
    }

    function updateReview(id, content) {
        fetch('/reviews', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, content })
        }).then(fetchReviews);
    }

    function openEditModal(id, content) {
        currentReviewId = id;
        editInput.value = content;
        editModal.style.display = 'block';
    }

    function closeEditModal() {
        editModal.style.display = 'none';
    }

    submitReview.addEventListener('click', () => {
        const content = reviewInput.value.trim();
        if (content) {
            addReview(content);
            reviewInput.value = '';
        }
    });

    saveEdit.addEventListener('click', () => {
        const content = editInput.value.trim();
        if (content) {
            updateReview(currentReviewId, content);
            closeEditModal();
        }
    });

    document.querySelector('.close').addEventListener('click', closeEditModal);

    window.onclick = function(event) {
        if (event.target == editModal) {
            closeEditModal();
        }
    };

    fetchReviews();
});



