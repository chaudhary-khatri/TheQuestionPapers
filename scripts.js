document.addEventListener('DOMContentLoaded', () => {
    const welcomeText = document.querySelector('#home h2');
    const messages = ["Welcome to the Question Paper !","Your One Stop Study Need!", "Happy Learning!"];
    let currentMessageIndex = 0;
    let index = 0;
    let isDeleting = false;
  
    function type() {
      const currentMessage = messages[currentMessageIndex];
  
      if (!isDeleting) {
        // Typing forward
        if (index < currentMessage.length) {
          welcomeText.textContent += currentMessage.charAt(index);
          index++;
          setTimeout(type, 100); // Typing speed
        } else {
          // Switch to deleting mode after typing is complete
          isDeleting = true;
          setTimeout(type, 1500); // Wait before deleting
        }
      } else {
        // Typing backward
        if (index > 0) {
          welcomeText.textContent = currentMessage.substring(0, index - 1);
          index--;
          setTimeout(type, 90); // Deleting speed
        } else {
          // Switch to the next message
          isDeleting = false;
          currentMessageIndex = (currentMessageIndex + 1) % messages.length;
          index = 0; // Reset index for the new message
          setTimeout(type, 500); // Wait before starting to type the new message
        }
      }
    }
  
    type(); // Start the typing effect
  });
  
  function toggleSection(event, sectionId) {
    event.preventDefault(); // Prevent default anchor click behavior

    // Get all document sections
    const sections = document.querySelectorAll('.doc-section');

    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the clicked section
    const selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';
}



document.addEventListener('DOMContentLoaded', function () {
  // Define content for each section
  const aboutUsContent = `
       <h2>About Us</h2>
      <p>Welcome to The Question Paper, your dedicated platform for accessing previous year question papers tailored specifically for the Indian education system. Our mission is to provide students, educators, and academic enthusiasts with easy access to a comprehensive database of question papers, helping you prepare effectively for your exams and assessments.</p>

      <h5>Our Story</h5>
      <p>Founded by passionate educators and tech enthusiasts, The Question Paper was born out of a desire to bridge the gap between students and valuable educational resources. We understand the challenges students face when searching for reliable study materials, and we aim to simplify that process. Our platform curates a diverse collection of question papers from various universities and courses, ensuring that you have everything you need at your fingertips.</p>

      <h4>What We Offer:</h4>
      <ul>
          <li><strong>Extensive Collection:</strong> Our database features a wide range of previous year question papers across multiple subjects, universities, and courses.</li>
          <li><strong>User-Friendly Interface:</strong> We’ve designed our website to be intuitive and easy to navigate, so you can find the resources you need without any hassle.</li>
          <li><strong>AI Integration:</strong> As we continue to evolve, we're working on integrating AI features to help you create mock tests and enhance your study experience.</li>
          <li><strong>Community Engagement:</strong> We encourage students to share their insights and feedback, fostering a collaborative learning environment.</li>
      </ul>

      <h5>Our Vision</h5>
      <p>At The Question Paper, we envision a future where quality education is accessible to all. We believe that every student should have the tools they need to succeed, and we are committed to continuously improving our platform to meet your academic needs.</p>

      <h5>Join Us</h5>
      <p>We invite you to explore our website, download question papers, and engage with our community. Whether you're a student preparing for your next exam or an educator seeking resources, The Question Paper is here to support your academic journey.</p>

      <p>Thank you for choosing us as your trusted educational partner. Together, let’s unlock the doors to knowledge and success!</p>
  `;

  const contactUsContent = `
      <h2>Contact Us</h2>
      <p>We’d love to hear from you! Whether you have questions, feedback, or suggestions, feel free to reach out to us. Our team is here to help you.</p>
      
      <h5>Get in Touch</h5>
      <p>Email: <a href="mailto:support@thequestionpaper.com">support@thequestionpaper.com</a></p>
      <p>Phone: +91-XXXXXXXXXX</p>
      
      <h5>Follow Us</h5>
      <p>Stay connected with us on social media for updates and educational tips:</p>
      <ul>
          <li>Facebook: <a href="#">The Question Paper Facebook</a></li>
          <li>Twitter: <a href="#">@TheQuestionPaper</a></li>
          <li>Instagram: <a href="#">@thequestionpaper</a></li>
      </ul>
      
      <h5>Feedback</h5>
      <p>Your thoughts matter! Please share your experience or any suggestions to help us improve. We value your input in making The Question Paper a better resource for everyone.</p>
      
      <p>Thank you for reaching out!</p>
  `;

  const privacyPolicyContent = `
      <h2>Privacy Policy</h2>
      <p><strong>Effective Date:</strong> [September 2024]</p>
      <p>At The Question Paper, your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website.</p>
      
      <h5>Information We Collect</h5>
      <ul>
          <li><strong>Personal Information:</strong> When you register or contact us, we may collect personal information such as your name, email address, and phone number.</li>
          <li><strong>Usage Data:</strong> We may collect information about how you access and use our website, including your IP address, browser type, and device information.</li>
      </ul>

      <h5>How We Use Your Information</h5>
      <p>We use your information for the following purposes:</p>
      <ul>
          <li>To provide and maintain our services.</li>
          <li>To communicate with you regarding your inquiries or account.</li>
          <li>To improve our website and enhance user experience.</li>
          <li>To send you updates, newsletters, or promotional materials (if you opt-in).</li>
      </ul>

      <h5>Data Security</h5>
      <p>We implement appropriate security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet is 100% secure.</p>

      <h5>Cookies</h5>
      <p>Our website may use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us analyze web traffic and improve our services. You can choose to accept or decline cookies through your browser settings.</p>

      <h5>Third-Party Links</h5>
      <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.</p>

      <h5>Changes to This Privacy Policy</h5>
      <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically for any updates.</p>

      <h5>Contact Us</h5>
      <p>If you have any questions or concerns about this Privacy Policy or our practices, please contact us at <a href="mailto:support@thequestionpaper.com">support@thequestionpaper.com</a>.</p>
      
      <p>Thank you for trusting The Question Paper with your information!</p>
  `;

  const termsOfServiceContent = `
            <h2>Terms and Conditions</h2>
      <p><strong>Effective Date:</strong> [September 2024]</p>
      <p>Welcome to The Question Paper. By accessing or using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.</p>

      <h5>1. Acceptance of Terms</h5>
      <p>By using our website, you agree to these Terms and Conditions, our Privacy Policy, and any additional terms applicable to specific sections of the site. If you do not agree, please do not use our website.</p>

      <h5>2. Use of the Website</h5>
      <p>You agree to use The Question Paper only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. You must not engage in any conduct that could damage, disable, or impair the website or interfere with any other party’s use of the website.</p>

      <h5>3. User Accounts</h5>
      <p>To access certain features, you may need to register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>

      <h5>4. Intellectual Property</h5>
      <p>All content, trademarks, and other intellectual property on this website are the property of The Question Paper or our licensors. You may not reproduce, distribute, or otherwise use any content without our prior written consent.</p>

      <h5>5. Disclaimers</h5>
      <p>The Question Paper provides access to previous year question papers for educational purposes only. We do not guarantee the accuracy, completeness, or reliability of any content on our website. We are not responsible for any loss or damage resulting from your use of the information provided on this website.</p>

      <h5>6. Limitation of Liability</h5>
      <p>To the fullest extent permitted by law, The Question Paper will not be liable for any indirect, incidental, or consequential damages arising out of your use of or inability to use the website.</p>

      <h5>7. Changes to Terms</h5>
      <p>We may update these Terms and Conditions from time to time. We will notify you of any changes by posting the new terms on this page. Your continued use of the website after any changes constitutes your acceptance of the revised terms.</p>

      <h5>8. Governing Law</h5>
      <p>These Terms and Conditions are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts located in [Your Location].</p>

      <h5>9. Contact Us</h5>
      <p>If you have any questions or concerns regarding these Terms and Conditions, please contact us at <a href="mailto:support@thequestionpaper.com">support@thequestionpaper.com</a>.</p>

      <p>Thank you for using The Question Paper!</p>
  `;

  const disclaimerContent = `
      <h2>Disclaimer</h2>
    <p><strong>Effective Date:</strong> [September 2024]</p>
    <p>The information provided by The Question Paper is for general informational purposes only. While we strive to ensure that the information on our website is accurate and up-to-date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.</p>

    <h5>1. Educational Purpose</h5>
    <p>The question papers available on The Question Paper are intended solely for educational purposes. We do not guarantee that the content will meet your specific needs or expectations.</p>

    <h5>2. No Endorsement</h5>
    <p>The Question Paper does not endorse or assume responsibility for any third-party websites or resources linked from our site. We are not responsible for the content, accuracy, or availability of these external sites.</p>

    <h5>3. No Liability</h5>
    <p>In no event will The Question Paper, its affiliates, or its employees be liable for any loss or damage, including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of or in connection with the use of this website.</p>

    <h5>4. Changes to Content</h5>
    <p>We reserve the right to modify or discontinue the content of the website at any time without notice. We do not guarantee that the website will be available at all times or that the content will be free from errors.</p>

    <h5>5. User Responsibility</h5>
    <p>It is the responsibility of users to verify any information before relying on it. Users should conduct their own research and seek professional advice as needed.</p>

    <h5>6. Changes to This Disclaimer</h5>
    <p>We may update this Disclaimer from time to time. Any changes will be posted on this page with an updated effective date. Your continued use of the website after any changes constitutes your acceptance of the revised disclaimer.</p>

    <h5>7. Contact Us</h5>
    <p>If you have any questions or concerns regarding this Disclaimer, please contact us at <a href="mailto:support@thequestionpaper.com">support@thequestionpaper.com</a>.</p>

    <p>Thank you for using The Question Paper!</p>
`;

  // Function to set up section content and styles
  function setupSection(sectionId, content) {
      const section = document.getElementById(sectionId);
      section.innerHTML = content;
      section.style.textAlign = 'left';
      section.style.padding = '20px';
      section.style.maxWidth = '800px';
      section.style.margin = '0 auto';
      section.style.display = 'none'; // Hide by default
  }

  // Set up each section
  setupSection('aboutUs', aboutUsContent);
  setupSection('contactUs', contactUsContent);
  setupSection('privacyPolicy', privacyPolicyContent);
  setupSection('termsOfService', termsOfServiceContent);
  setupSection('disclaimer', disclaimerContent);

  // Function to show a specific section
  function showSection(sectionToShow) {
      const sections = ['aboutUs', 'contactUs', 'privacyPolicy', 'termsOfService', 'disclaimer'];
      sections.forEach(sectionId => {
          const section = document.getElementById(sectionId);
          section.style.display = sectionId === sectionToShow ? 'block' : 'none';
      });
  }

  // Navigation link event listeners
  document.getElementById('aboutLink').addEventListener('click', function () {
      showSection('aboutUs');
  });

  document.getElementById('contactLink').addEventListener('click', function () {
      showSection('contactUs');
  });

  document.getElementById('privacyLink').addEventListener('click', function () {
      showSection('privacyPolicy');
  });

  document.getElementById('termsLink').addEventListener('click', function () {
      showSection('termsOfService');
  });

  document.getElementById('disclaimerLink').addEventListener('click', function () {
      showSection('disclaimer');
  });
});

