document.addEventListener('DOMContentLoaded', () => {
    const cameraScanButton = document.getElementById('camera-scan');
    const fileUploadInput = document.getElementById('file-upload');
    const productDetailsContainer = document.getElementById('product-details');

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
                type: 'ocr',
                value: text
            });
        });
    }

    // Display Product Details
    function displayProductDetails(scanResult) {
        // This is a mock implementation. In a real app, you'd 
        // connect to a backend or product database
        const mockProductDetails = {
            name: scanResult.type === 'barcode' 
                ? 'Sample Product' 
                : extractProductName(scanResult.value),
            mrp: '₹99.99',
            expiryDate: '12/2025',
            barcodeType: scanResult.type
        };

        productDetailsContainer.innerHTML = `
            <div class="product-info-item">
                <span class="product-info-label">Product:</span>
                ${mockProductDetails.name}
            </div>
            <div class="product-info-item">
                <span class="product-info-label">MRP:</span>
                ${mockProductDetails.mrp}
            </div>
            <div class="product-info-item">
                <span class="product-info-label">Expiry:</span>
                ${mockProductDetails.expiryDate}
            </div>
            <div class="product-info-item">
                <span class="product-info-label">Scan Type:</span>
                ${mockProductDetails.barcodeType}
            </div>
        `;
    }

    // Basic product name extraction from OCR text
    function extractProductName(ocrText) {
        // Implement basic text parsing logic
        const lines = ocrText.split('\n');
        return lines[0] || 'Unknown Product';
    }
});