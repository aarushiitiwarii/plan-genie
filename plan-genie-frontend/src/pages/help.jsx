import React from "react";
import styles from "./help.module.css";

export default function Help() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Need Help?</h2>
      <div className={styles.faqSection}>
        <h3>Frequently Asked Questions</h3>
        <ul className={styles.faqList}>
          <li>
            <strong>How do I create a new learning plan?</strong>
            <p>Click on "Get Started" on the home page and follow the prompts to set your goals and availability.</p>
          </li>
          <li>
            <strong>How do I update my profile?</strong>
            <p>Go to the Profile page by clicking your profile icon and selecting "Profile".</p>
          </li>
          <li>
            <strong>How do I view my progress?</strong>
            <p>Visit the History page to see your completed modules and actions.</p>
          </li>
          <li>
            <strong>Who do I contact for support?</strong>
            <p>Email us at <a href="mailto:support@plangenie.com">support@plangenie.com</a>.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
