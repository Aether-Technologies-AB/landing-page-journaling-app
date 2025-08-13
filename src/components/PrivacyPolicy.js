import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1>Privacy Policy for Nest of Memories</h1>
      <p className="last-updated">Last Updated: July 16, 2025</p>
      
      <p>Welcome to Nest of Memories. We are committed to protecting your privacy and handling your personal data in an open and transparent manner. This privacy policy explains what information we collect from you, how we use and protect it, and your rights in relation to this information.</p>
      
      <p>By using the Nest of Memories application (the "App"), you agree to the collection and use of information in accordance with this policy.</p>
      
      <h2>1. Information We Collect</h2>
      <p>We collect information to provide and improve our service to you. The types of information we collect are:</p>
      
      <h3>a) Information You Provide Directly:</h3>
      <ul>
        <li><strong>Account Information:</strong> When you create an account, we collect your email address and a unique user ID for authentication purposes.</li>
        <li><strong>Journal Entries:</strong> The text content of your journal entries and transcriptions, which may contain sensitive personal information.</li>
        <li><strong>Audio Recordings:</strong> The audio files you record and upload for transcription.</li>
        <li><strong>Family Member Information:</strong> Information you provide about your family members, such as names and relationships, to help organize your journal.</li>
      </ul>
      
      <h3>b) Information We Collect Automatically:</h3>
      <ul>
        <li><strong>Usage Data:</strong> We automatically collect information on how the App is accessed and used. This may include information such as your device's Internet Protocol (IP) address, device type, operating system version, the pages of our App that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data. This is collected through Firebase Analytics.</li>
      </ul>
      
      <h2>2. How We Use Your Information</h2>
      <p>We use the collected data for various purposes:</p>
      <ul>
        <li><strong>To Provide and Maintain Our Service:</strong> To authenticate you, store your journal entries and audio files, and enable the core features of the App.</li>
        <li><strong>To Improve Our App:</strong> To understand how our users interact with the App and to improve the user experience.</li>
        <li><strong>To Enable Search:</strong> To allow you to search through your journal entries efficiently.</li>
        <li><strong>To Communicate With You:</strong> To contact you with important information regarding your account or our services (though we aim to keep this to a minimum).</li>
      </ul>
      
      <h2>3. Third-Party Services and Data Sharing</h2>
      <p>We do not sell your personal data. However, we rely on trusted third-party services to provide our App's functionality. These services have their own privacy policies and handle your data as described below:</p>
      <ul>
        <li><strong>Google Firebase:</strong> We use Firebase for several key features:
          <ul>
            <li><strong>Firebase Authentication:</strong> To manage user sign-in and authentication.</li>
            <li><strong>Firebase Firestore:</strong> To store your account information and journal entries in a secure database.</li>
            <li><strong>Firebase Storage:</strong> To store your audio recordings.</li>
            <li><strong>Firebase Analytics:</strong> To collect anonymous usage data to help us improve the app.</li>
          </ul>
          You can review Google's privacy policy here: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>
        </li>
        <li><strong>Algolia:</strong> We use Algolia to provide fast and accurate search functionality for your journal entries. The text content of your transcriptions is indexed on Algolia's servers to make them searchable. You can review Algolia's privacy policy here: <a href="https://www.algolia.com/policies/privacy/" target="_blank" rel="noopener noreferrer">https://www.algolia.com/policies/privacy/</a></li>
      </ul>
      
      <h2>4. Data Storage and Security</h2>
      <p>The security of your data is our top priority. Your data is stored on secure servers provided by Google Firebase, which uses industry-standard encryption to protect your data both in transit (using TLS) and at rest. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
      
      <h2>5. Your Data Rights</h2>
      <p>You have control over your personal data. Within the App, you have the right to:</p>
      <ul>
        <li>Access and Update your information.</li>
        <li>Delete individual journal entries or audio files.</li>
        <li><strong>Delete Your Account:</strong> You can request the deletion of your entire account and all associated data by contacting us.</li>
      </ul>
      
      <h2>6. Children's Privacy</h2>
      <p>Our service is not directed to children under the age of 13. The App is intended for parents and guardians to document their family's journey. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data without your consent, please contact us.</p>
      
      <h2>7. Changes to This Privacy Policy</h2>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the App and updating the "Last Updated" date at the top of this policy. You are advised to review this Privacy Policy periodically for any changes.</p>
      
      <h2>8. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@nestofmemories.com">support@nestofmemories.com</a></p>
    </div>
  );
};

export default PrivacyPolicy;
