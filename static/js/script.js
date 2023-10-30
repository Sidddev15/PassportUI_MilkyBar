function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            var video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = function (e) {
                video.play();
            };

            var videoContainer = document.getElementById('videoContainer');
            videoContainer.innerHTML = ''; // Clear any previous content
            videoContainer.appendChild(video);

            var captureButton = document.createElement('button');
            captureButton.textContent = 'Capture';
            captureButton.onclick = function () {
                var canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

                var imageDataUrl = canvas.toDataURL('image/png');
                var base64Image = imageDataUrl.replace(/^data:image\/(png|jpg);base64,/, "");

                localStorage.setItem('userImage', base64Image);

                // Replace the fallback image with the clicked image
                var fallbackImage = document.getElementById('fallback');
                fallbackImage.src = imageDataUrl;
            };

            videoContainer.appendChild(captureButton);
        })
        .catch(function (err) {
            console.log("Error accessing camera: " + err);
        });
}


document.getElementById('nameInput').addEventListener('input', function (e) {
    var value = e.target.value;
    value = value.replace(/[^a-zA-Z]/g, '');
    if (value.length > 10) {
        e.target.value = value.substring(0, 10);
    }
});

document.getElementById('nameInput').addEventListener('input', function (e) {
    localStorage.setItem('userName', e.target.value);
});

function downloadMap() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var imageBase64 = localStorage.getItem('userImage');
    var userName = localStorage.getItem('userName');
    if (imageBase64) {
        var userImage = new Image();
        userImage.src = 'data:image/png;base64,' + imageBase64;

        userImage.onload = function () {
            canvas.width = userImage.width; // Set canvas size to the user's image size
            canvas.height = userImage.height;

            ctx.drawImage(userImage, 0, 0, canvas.width, canvas.height);

            // Create a download link with the user's name
            var downloadLink = document.createElement('a');
            downloadLink.href = canvas.toDataURL('image/png');
            downloadLink.download = userName + '.png'; // Set the download file name with the user's name
            downloadLink.id = 'downloadLink'; // Set an id for the download link
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
        };
    } else {
        alert("Please take a photo and save it before downloading");
    }
}

// Check if a name is stored in localStorage
var storedName = localStorage.getItem('userName');

// Get the input element for the name
var nameInput = document.getElementById('nameInput');

// Set the value of the input element to the stored name
if (storedName) {
    nameInput.value = storedName;
}

// Add an event listener to the "Save" button to update the stored name
var saveButton = document.querySelector('.button');
saveButton.addEventListener('click', function () {

    // Store the new name in localStorage
    localStorage.setItem('userName', newName);

    var userName = localStorage.getItem('userName');
    var nameInput = document.getElementById('nameInput');
    if (userName) {
        nameInput.value = userName;
    }
});


document.addEventListener('DOMContentLoaded', function () {
    downloadMap();

    document.getElementById('downloadLink').addEventListener('click', function (e) {
        e.preventDefault();

        var link = document.createElement('a');
        link.href = document.getElementById('downloadLink').href;
        link.download = 'userImage.png';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});

// downloading passport image 
function downloadPassport() {
    var passportContainer = document.querySelector('.passport-screen');
    html2canvas(passportContainer).then(function (canvas) {
        var downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'passport.png';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
    });
}

