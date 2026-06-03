/* =============================================================
   emailjs-config.js
   -------------------------------------------------------------
   Sends Contact form messages straight to the owner's inbox
   (clemony01@gmail.com) using EmailJS — no backend required.

   ONE-TIME SETUP:
   1. Sign up (free) at https://www.emailjs.com/
   2. Email Services → "Add New Service" → choose Gmail and
      connect clemony01@gmail.com. Note the SERVICE ID.
   3. Email Templates → "Create New Template".
        - In the "To Email" field put: clemony01@gmail.com
        - In the template body use these variables:
            From: {{from_name}} <{{from_email}}>
            Message:
            {{message}}
        - Save. Note the TEMPLATE ID.
   4. Account → General → copy your PUBLIC KEY.
   5. Replace the three REPLACE_ME values below.
   ============================================================= */

window.EMAILJS_PUBLIC_KEY = "63TEWY3W2J8mUeMzC";
window.EMAILJS_SERVICE_ID = "service_m5vq2ze";
window.EMAILJS_TEMPLATE_ID = "template_buqj9kc";