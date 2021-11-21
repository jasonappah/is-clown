import { ElementHandle } from "puppeteer";

const hide = (el: ElementHandle<HTMLElement>) => {
	el.evaluate((e) => (e.style.display = "none"));
};
export default async () => {
	require("dotenv").config();
	const axios = require("axios").default;
	const puppeteer = require("puppeteer");
	const FormData = require("form-data");

	const {
		HAC_USER,
		HAC_PASS,
		HAC_URL,
		CLOWN_UID,
		SLACK_TOKEN,
		CLOWN_CHANNEL,
		BB_USER,
		BB_PASS,
		BB_URL,
	} = process.env;
	const browser = await puppeteer.launch({
		headless: process.env.NODE_ENV === "production",
		args: ['--disable-dev-shm-usage'],
	});
	try {
		const page = await browser.newPage();
		await page.setViewport({
			width: 1920,
			height: 1080,
			deviceScaleFactor: 1,
			slowMo: 500,
		});
		await page.goto(HAC_URL);
		await page.type("#LogOnDetails_UserName", HAC_USER);
		await page.type("#LogOnDetails_Password", HAC_PASS);
		await page.click("#login");
		await page.waitForNavigation();
		const [teachers, classIds] = await Promise.all([
			page.$$("#staffName"),
			page.$$("table > tbody > tr > td:nth-child(1) > div > div"),
		]);
		teachers.forEach(hide);
		classIds.forEach(hide);
		const img: Buffer = await page.screenshot({ type: "png" });

		const fd = new FormData();
		const filename = "grades.png";
		fd.append("file", img, filename);
		fd.append("initial_comment", `lmaooooo look at <@${CLOWN_UID}>'s grades`);
		fd.append("filetype", "png");
		fd.append("channels", CLOWN_CHANNEL);
		fd.append("filename", filename);
		fd.append("title", "ahahahaha");

		await page.goto(BB_URL);
		await page.type("#okta-signin-username", BB_USER);
		await page.type("#okta-signin-password", BB_PASS);
		await page.click("#okta-signin-submit");
		await page.waitForNavigation();
		await page.waitForSelector("#global-nav-link");
		await page.click("#global-nav-link");
		await page.waitForSelector("#MyGradesOnMyBb_____MyGradesTool");
		await page.click("#MyGradesOnMyBb_____MyGradesTool");
		await page.waitForTimeout(5000);

		const img2: Buffer = await page.screenshot({ type: "png" });
		const fd2 = new FormData();
		fd2.append("file", img2, filename);
		fd2.append("initial_comment", `:eyes:`);
		fd2.append("filetype", "png");
		fd2.append("channels", CLOWN_CHANNEL);
		fd2.append("filename", filename);
		fd2.append("title", "ahahahaha");

		await axios.post("https://slack.com/api/files.upload", fd, {
			headers: {
				Authorization: `Bearer ${SLACK_TOKEN}`,
				...fd.getHeaders(),
			},
		});

		await axios.post("https://slack.com/api/files.upload", fd2, {
			headers: {
				Authorization: `Bearer ${SLACK_TOKEN}`,
				...fd2.getHeaders(),
			},
		});
	} catch (e) {
		console.error(e);
	} finally {
		await browser.close();
	}
};
