document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('analyzeBtn').addEventListener('click', async function() {
        const fileInput = document.getElementById('contractFile');
        const emailInput = document.getElementById('email');
        
        // Check if file is selected
        if (!fileInput.files[0]) {
            alert('Please select a contract file first');
            return;
        }
        
        if (!emailInput.value) {
            alert('Please enter your email');
            return;
        }
        
        // Show loading spinner
        document.getElementById('loading').style.display = 'block';
        document.getElementById('statusMessage').textContent = 'Analyzing contract...';
        
        const file = fileInput.files[0];
        
        // Convert file to base64
        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64Data = e.target.result.split(',')[1];
            
            try {
                // Send to Make webhook - REPLACE THIS URL WITH YOUR MAKE WEBHOOK URL
                const response = await fetch('https://hook.us2.make.com/fbpv4vhqqtyc5ixjl8d2c6cmhio3jiun', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        base64pdf: base64Data,
                        email: emailInput.value,
                        prompt: "Extract key dates and information from this real estate contract and return as valid JSON with this exact format: {\"propertyAddress\": \"address here\", \"closingDate\": \"YYYY-MM-DD\", \"inspectionDate\": \"YYYY-MM-DD\", \"appraisalDate\": \"YYYY-MM-DD\", \"financingDate\": \"YYYY-MM-DD\", \"buyerName\": \"name here\", \"sellerName\": \"name here\", \"purchasePrice\": \"price here\"}"
                    })
                });
                
                const result = await response.text();
                
                if (response.ok) {
                    document.getElementById('statusMessage').textContent = 'Contract analyzed successfully! Check your email for calendar invites.';
                    document.getElementById('contractForm').reset();
                } else {
                    document.getElementById('statusMessage').textContent = 'Error analyzing contract: ' + result;
                }
                
            } catch (error) {
                document.getElementById('statusMessage').textContent = 'Error: ' + error.message;
            } finally {
                document.getElementById('loading').style.display = 'none';
            }
        };
        
        reader.readAsDataURL(file);
    });
});
