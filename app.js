document.addEventListener('DOMContentLoaded', () => {
    const cameraScanButton = document.getElementById('camera-scan');
    const fileUploadInput = document.getElementById('file-upload');
    const productDetailsContainer = document.getElementById('product-details');
    const infoButton = document.getElementById('info-button');
    const aboutButton = document.getElementById('about-button');

    // Barcode Scanning Configuration
    const html5QrCode = new Html5Qrcode("qr-reader");

    // Camera Scan Button Handler
    cameraScanButton.addEventListener('click', () => {
        html5QrCode.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            onScanSuccess
        );
    });

    // File Upload Handler
    fileUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            processImageOCR(file);
        }
    });

    // Barcode Scan Success Callback
    function onScanSuccess(decodedText, decodedResult) {
        html5QrCode.stop();
        displayProductDetails({
            type: 'barcode',
            value: decodedText
        });
    }

    // Image OCR Processing
    function processImageOCR(file) {
        Tesseract.recognize(
            file,
            'eng',
            { 
                logger: m => console.log(m) 
            }
        ).then(({ data: { text } }) => {
            displayProductDetails({
                value: text
            });
        });
    }

    // Display Product Details
    function displayProductDetails(scanResult) {
        const productName = extractProductName(scanResult.value);
        const mrp = extractMRP(scanResult.value);
        const expiryDate = extractExpiryDate(scanResult.value);

        productDetailsContainer.innerHTML = `
            <div class="product-info-item">
                <span class="product-info-label">Product:</span>
                ${productName || 'Unknown Product'}
            </div>
            <div class="product-info-item">
                <span class="product-info-label">MRP:</span>
                ${mrp || 'Unknown'}
            </div>
            <div class="product-info-item">
                <span class="product-info-label">Expiry:</span>
                ${expiryDate || 'Unknown'}
            </div>
        `;
    }

    // Basic product name extraction from OCR text
    function extractProductName(ocrText) {
        const lines = ocrText.split('\n');
        return lines[0] || 'Unknown Product';
    }

    // Extract MRP from OCR text
    function extractMRP(ocrText) {
        const mrpMatch = ocrText.match(/₹\d+(\.\d{1,2})?/);
        return mrpMatch ? mrpMatch[0] : null;
    }

    // Extract expiry date from OCR text
    function extractExpiryDate(ocrText) {
        const expiryMatch = ocrText.match(/(0[1-9]|1[0-2])\/\d{4}/);
        return expiryMatch ? expiryMatch[0] : null;
    }

    // Info Button Handler
    infoButton.addEventListener('click', () => {
        alert('This app scans product details like name, MRP, and expiry date using OCR.');
    });

    // About Button Handler
    aboutButton.addEventListener('click', () => {
        alert('Qscan App v1.0\nDeveloped by [Your Name].');
    });
});