import React, { useState } from "react";
import styles from "../pages/home.module.css";

// Q&A map for Wishbot (with <b> tags for course names)
const wishbotQA = [
	{
		keywords: ["software", "course"],
		a: `For Software Engineering, available courses are: <b>Web Development</b>, <b>React</b>, <b>DSA</b>, <b>Backend Development</b>, <b>DevOps</b>, <b>Mobile App Development</b>, <b>Machine Learning</b>, and <b>System Design</b>.`,
	},
	{
		keywords: ["hardware", "course"],
		a: `For Hardware Engineering, available courses are: <b>Embedded Systems</b>, <b>VLSI Design</b>, <b>Microcontrollers</b>, <b>FPGA Programming</b>, <b>PCB Design</b>, <b>IoT</b>, and <b>Digital Signal Processing</b>.`,
	},
	{
		keywords: ["domain"],
		a: "You can choose between <b>Software Engineering</b> and <b>Hardware Engineering</b>.",
	},
	{
		keywords: ["roadmap"],
		a: "A roadmap is a step-by-step learning plan tailored to your selected domain, course, and time commitment.",
	},
	{
		keywords: ["profile"],
		a: "Click the user icon at the top right and select <b>Profile</b> from the dropdown menu.",
	},
	{
		keywords: ["history"],
		a: "Click the user icon at the top right and select <b>History</b> from the dropdown menu.",
	},
	{
		keywords: ["sign out", "logout", "log out"],
		a: "Click the user icon at the top right and select <b>Sign Out</b> from the dropdown menu.",
	},
	{
		keywords: ["help", "support"],
		a: "Click the user icon and select <b>Help</b> for support or more information.",
	},
	{
		keywords: ["free", "pay", "pricing"],
		a: "PlanGenie is currently <b>free</b> to use for all users.",
	},
	{
		keywords: ["wishbot", "who are you", "what can you do"],
		a: "I'm Wishbot, your friendly assistant! Ask me anything about using PlanGenie.",
	},
	{
		keywords: ["plangenie", "website", "site", "purpose"],
		a: "PlanGenie is a platform that creates personalized learning roadmaps based on your goals and availability.",
	},
	{
		keywords: ["start", "use", "how"],
		a: "Click the <b>Get Started</b> button on the homepage. If you’re not logged in, you’ll be prompted to log in or sign up. Then, fill in your learning preferences to generate your roadmap.",
	},
	{
		keywords: ["login", "sign up", "register"],
		a: "You need to <b>log in</b> or <b>sign up</b> to generate and save your personalized learning roadmap.",
	},
	{
		keywords: ["creator", "who made", "who created"],
		a: "PlanGenie was created by passionate developers to help learners achieve their goals efficiently.",
	},
	{
		keywords: ["password"],
		a: "Currently, password management is handled through your account settings. Please check your profile page.",
	},
	{
		keywords: ["hello", "hi", "hey", "greetings"],
		a: "Hello! How can I help you with PlanGenie today?",
	},
	{
		keywords: ["thanks", "thank you", "thx", "appreciate"],
		a: "You're welcome! If you have more questions, just ask.",
	},
	{
		keywords: ["bug", "issue", "problem", "error"],
		a: "If you encounter a bug or issue, please refresh the page or contact support through the Help section.",
	},
	{
		keywords: ["feature", "suggestion", "request"],
		a: "We love feedback! Please use the Help section to submit your feature requests or suggestions.",
	},
	{
		keywords: ["time", "how long", "duration"],
		a: "Each roadmap is tailored to your available hours per week. You can adjust your preferences on the homepage.",
	},
	{
		keywords: ["language", "hindi", "other language"],
		a: "Currently, PlanGenie is available in English only. More languages may be supported in the future!",
	},
	{
		keywords: ["mobile", "app", "android", "ios"],
		a: "PlanGenie is best experienced on the web, but a mobile app is in our future plans!",
	},
	{
		keywords: ["dark mode", "theme", "appearance"],
		a: "PlanGenie uses a modern theme. Dark mode support is coming soon!",
	},
	{
		keywords: ["joke", "funny", "laugh"],
		a: "Why did the developer go broke? Because he used up all his cache! 😄",
	},
	{
		keywords: ["ai", "artificial intelligence", "machine"],
		a: "PlanGenie uses AI to help generate personalized learning roadmaps for you!",
	},
	// Catch-all: always matches if nothing else does
	{
		keywords: ["*"],
		a: "I'm here to help with anything related to PlanGenie! Please try rephrasing your question or ask about features, usage, or support.",
	},
];

function getWishbotAnswer(userInput) {
	const input = userInput.trim().toLowerCase();
	for (const { keywords, a } of wishbotQA) {
		if (keywords.includes("*")) return a; // catch-all at the end
		if (keywords.some((keyword) => input.includes(keyword))) {
			return a;
		}
	}
	return "I'm here to help with anything related to PlanGenie! Please try rephrasing your question or ask about features, usage, or support.";
}

export default function WishbotChat() {
	const [messages, setMessages] = useState([
		{ from: "bot", text: "Hi! I'm Wishbot 🤖. Ask me anything about PlanGenie!" },
	]);
	const [input, setInput] = useState("");

	const handleSend = (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		const userMsg = { from: "user", text: input };
		const botMsg = { from: "bot", text: getWishbotAnswer(input) };
		setMessages([...messages, userMsg, botMsg]);
		setInput("");
	};

	return (
		<div className={styles.wishbotChat}>
			<div className={styles.wishbotMessages}>
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={
							msg.from === "bot"
								? styles.wishbotMsgBot
								: styles.wishbotMsgUser
						}
						// Render bot messages as HTML to support <b> tags
						{...(msg.from === "bot"
							? { dangerouslySetInnerHTML: { __html: msg.text } }
							: { children: msg.text })}
					/>
				))}
			</div>
			<form className={styles.wishbotInputBar} onSubmit={handleSend}>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Ask me anything..."
					className={styles.wishbotInput}
				/>
				<button type="submit" className={styles.wishbotSendBtn}>
					Send
				</button>
			</form>
		</div>
	);
}