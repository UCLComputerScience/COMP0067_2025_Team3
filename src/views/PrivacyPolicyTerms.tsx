"use client";

import React from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface PrivacyPolicyTermsProps {
  open: boolean;
  onClose: () => void;
}

export const PrivacyPolicyTerms: React.FC<PrivacyPolicyTermsProps> = ({ open, onClose }) => {
  return (
    <Dialog  open={open}  onClose={onClose}  maxWidth="md"  fullWidth scroll="paper" aria-labelledby="privacy-policy-terms-title">
      <DialogTitle id="privacy-policy-terms-title">Privacy Policy & Terms</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom>Privacy Policy</Typography>
          
          <Typography variant="h6" gutterBottom>1. Introduction</Typography>
          <Typography paragraph>
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare platform. 
            Please read this Privacy Policy carefully. By accessing or using our platform, you agree to the terms of this Privacy Policy.
          </Typography>
          
          <Typography variant="h6" gutterBottom>2. Information We Collect</Typography>
          <Typography variant="subtitle1" gutterBottom>2.1 Personal Information</Typography>
          <Typography paragraph>We may collect the following categories of personal information:</Typography>
          <ul>
            <li>
              <Typography paragraph>
                <strong>Account Information:</strong> Name, email address, phone number, password, profession, institution, and registration number (for clinicians).
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Profile Information:</strong> Date of birth, address, and other information provided during registration.
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Health Information:</strong> If you are a patient, we may collect health-related information provided by you or your healthcare providers.
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Research Data:</strong> If you participate in research studies, data collected as part of those studies.
              </Typography>
            </li>
            <li>
              <Typography paragraph>
                <strong>Usage Data:</strong> Information about how you interact with our platform, including log data, device information, and IP address.
              </Typography>
            </li>
          </ul>
          
          <Typography variant="subtitle1" gutterBottom>2.2 Legal Basis for Processing (GDPR)</Typography>
          <Typography paragraph>We process your personal data on the following legal bases:</Typography>
          <ul>
            <li><Typography>Contract performance (to provide our services)</Typography></li>
            <li><Typography>Your consent</Typography></li>
            <li><Typography>Legitimate interests (to improve our services)</Typography></li>
            <li><Typography>Legal obligations</Typography></li>
            <li><Typography>Vital interests (when processing health data in emergency situations)</Typography></li>
            <li><Typography>Public interest (for research and statistical purposes with appropriate safeguards)</Typography></li>
          </ul>
          
          <Typography variant="h6" gutterBottom>3. How We Use Your Information</Typography>
          <Typography paragraph>We use the information we collect to:</Typography>
          <ul>
            <li><Typography>Create and maintain your account</Typography></li>
            <li><Typography>Provide and improve our services</Typography></li>
            <li><Typography>Process and complete transactions</Typography></li>
            <li><Typography>Communicate with you</Typography></li>
            <li><Typography>Respond to your inquiries</Typography></li>
            <li><Typography>Send administrative information</Typography></li>
            <li><Typography>For research purposes (with appropriate consent)</Typography></li>
            <li><Typography>Comply with legal obligations</Typography></li>
            <li><Typography>Protect our rights and prevent fraud</Typography></li>
          </ul>
          
          <Typography variant="h6" gutterBottom>4. Data Sharing and Disclosure</Typography>
          <Typography paragraph>We may share your information with:</Typography>
          <ul>
            <li>
              <Typography>
                <strong>Healthcare Providers:</strong> To facilitate your medical care (with your consent)
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>Researchers:</strong> For approved research purposes (with your consent)
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>Service Providers:</strong> Third parties who perform services on our behalf
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>Legal Requirements:</strong> When required by law, court order, or governmental regulation
              </Typography>
            </li>
            <li>
              <Typography>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
              </Typography>
            </li>
          </ul>
          <Typography paragraph>We will never sell your personal information to third parties.</Typography>
          
          <Typography variant="h6" gutterBottom>5. Data Protection and Security</Typography>
          <Typography paragraph>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, 
            so we cannot guarantee absolute security.
          </Typography>
          
          <Typography variant="h6" gutterBottom>6. Your Data Protection Rights (GDPR)</Typography>
          <Typography paragraph>If you are in the European Economic Area (EEA), you have the following rights:</Typography>
          <ul>
            <li><Typography><strong>Right to Access:</strong> Request access to your personal information</Typography></li>
            <li><Typography><strong>Right to Rectification:</strong> Request correction of inaccurate personal information</Typography></li>
            <li><Typography><strong>Right to Erasure:</strong> Request deletion of your personal information</Typography></li>
            <li><Typography><strong>Right to Restrict Processing:</strong> Request restriction of processing of your personal information</Typography></li>
            <li><Typography><strong>Right to Data Portability:</strong> Request transfer of your personal information</Typography></li>
            <li><Typography><strong>Right to Object:</strong> Object to processing of your personal information</Typography></li>
            <li><Typography><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</Typography></li>
          </ul>
          <Typography paragraph>To exercise these rights, please contact us using the details provided below.</Typography>
          
          <Typography variant="h6" gutterBottom>7. Data Retention</Typography>
          <Typography paragraph>
            We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
            and as required by law. When we no longer need to use your information, we will securely delete or anonymize it.
          </Typography>
          
          <Typography variant="h6" gutterBottom>8. International Data Transfers</Typography>
          <Typography paragraph>
            Your information may be transferred to, and processed in, countries other than the country in which you reside. 
            Where we transfer data outside the EEA, we ensure appropriate safeguards are in place in accordance with GDPR requirements, 
            such as Standard Contractual Clauses or Privacy Shield certification.
          </Typography>
          
          <Typography variant="h6" gutterBottom>9. Changes to This Privacy Policy</Typography>
          <Typography paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
            on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </Typography>

          <Typography variant="h5" component="h2" sx={{ mt: 4 }} gutterBottom>Terms of Service</Typography>
          
          <Typography variant="h6" gutterBottom>1. Acceptance of Terms</Typography>
          <Typography paragraph>
            By accessing or using our platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
            If you do not agree with any of these terms, you are prohibited from using or accessing our platform.
          </Typography>
          
          <Typography variant="h6" gutterBottom>2. Account Registration and Security</Typography>
          
          <Typography variant="subtitle1" gutterBottom>2.1 Account Creation</Typography>
          <Typography paragraph>
            To use certain features of our platform, you must register for an account. You agree to provide accurate, current, 
            and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>2.2 Account Types</Typography>
          <Typography paragraph>Our platform offers different account types:</Typography>
          <ul>
            <li><Typography>Patient: For individuals seeking healthcare services</Typography></li>
            <li><Typography>Clinician: For healthcare professionals</Typography></li>
            <li><Typography>Researcher: For individuals conducting research</Typography></li>
          </ul>
          
          <Typography variant="subtitle1" gutterBottom>2.3 Account Security</Typography>
          <Typography paragraph>
            You are responsible for safeguarding the password that you use to access our platform and for any activities 
            or actions under your password. You agree not to disclose your password to any third party.
          </Typography>
          
          <Typography variant="h6" gutterBottom>3. User Conduct</Typography>
          <Typography paragraph>You agree not to:</Typography>
          <ul>
            <li><Typography>Use our platform in any way that violates any applicable laws or regulations</Typography></li>
            <li><Typography>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity</Typography></li>
            <li><Typography>Interfere with or disrupt the operation of our platform</Typography></li>
            <li><Typography>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, or otherwise objectionable</Typography></li>
            <li><Typography>Attempt to gain unauthorized access to any portion of our platform</Typography></li>
            <li><Typography>Use our platform for any purpose that is unlawful or prohibited by these Terms</Typography></li>
          </ul>
          
          <Typography variant="h6" gutterBottom>4. Intellectual Property</Typography>
          <Typography paragraph>
            Our platform and its contents are protected by copyright, trademark, and other laws. You may not modify, reproduce, 
            distribute, create derivative works or adaptations of, publicly display or in any way exploit our platform or 
            its content in whole or in part except as expressly authorized by us.
          </Typography>
          
          <Typography variant="h6" gutterBottom>5. Healthcare and Medical Information</Typography>
          
          <Typography variant="subtitle1" gutterBottom>5.1 Not Medical Advice</Typography>
          <Typography paragraph>
            Information provided on our platform is for informational purposes only and is not intended as a substitute for 
            professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified 
            health provider with any questions you may have regarding a medical condition.
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>5.2 Clinician Responsibilities</Typography>
          <Typography paragraph>
            If you are a clinician, you are responsible for complying with all applicable laws, regulations, 
            and professional standards related to the provision of healthcare services.
          </Typography>
          
          <Typography variant="h6" gutterBottom>6. Research Activities</Typography>
          <Typography paragraph>If you participate in research activities through our platform:</Typography>
          <ul>
            <li><Typography>You must provide informed consent before participating</Typography></li>
            <li><Typography>You may withdraw your participation at any time</Typography></li>
            <li><Typography>Research data will be handled in accordance with applicable laws and ethical standards</Typography></li>
          </ul>
          
          <Typography variant="h6" gutterBottom>7. Limitation of Liability</Typography>
          <Typography paragraph>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, 
            consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, 
            or any loss of data, use, goodwill, or other intangible losses resulting from:
          </Typography>
          <ul>
            <li><Typography>Your use or inability to use our platform</Typography></li>
            <li><Typography>Any unauthorized access to or use of our servers and/or any personal information stored therein</Typography></li>
            <li><Typography>Any interruption or cessation of transmission to or from our platform</Typography></li>
          </ul>
          
          <Typography variant="h6" gutterBottom>8. Indemnification</Typography>
          <Typography paragraph>
            You agree to defend, indemnify, and hold us harmless from and against any claims, liabilities, damages, 
            losses, and expenses, including without limitation reasonable attorney fees and costs, arising out of or 
            in any way connected with your access to or use of our platform or your violation of these Terms.
          </Typography>
          
          <Typography variant="h6" gutterBottom>9. Termination</Typography>
          <Typography paragraph>
            We may terminate or suspend your account and access to our platform immediately, without prior notice or liability, 
            for any reason whatsoever, including without limitation if you breach these Terms.
          </Typography>
          
          <Typography variant="h6" gutterBottom>10. Governing Law</Typography>
          <Typography paragraph>
            These Terms shall be governed by and construed in accordance with the laws of [Applicable Jurisdiction], 
            without regard to its conflict of law provisions.
          </Typography>
          
          <Typography variant="h6" gutterBottom>11. Changes to Terms</Typography>
          <Typography paragraph>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes 
            by posting the new Terms on our platform. Your continued use of our platform following the posting of 
            revised Terms means that you accept and agree to the changes.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

