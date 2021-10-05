import { ElementHandle } from "puppeteer";

export default async () => {
	const axios = require("axios").default;
	const puppeteer = require("puppeteer");
	const FormData = require("form-data");
	require("dotenv").config();

	const hide = (el: ElementHandle<HTMLElement>) => {
		el.evaluate((e) => (e.style.display = "none"));
	};
	const { HAC_USER, HAC_PASS, HAC_URL, CLOWN_UID, SLACK_TOKEN, CLOWN_CHANNEL } =
		process.env;
	const browser = await puppeteer.launch({
		headless: process.env.NODE_ENV === "production",
	});
	try {
		const page = await browser.newPage();
		await page.setViewport({
			width: 1920,
			height: 1080,
			deviceScaleFactor: 1,
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

		await axios.post("https://slack.com/api/files.upload", fd, {
			headers: {
				Authorization: `Bearer ${SLACK_TOKEN}`,
				...fd.getHeaders(),
			},
		});
	} catch (e) {
		console.error(e);
	} finally {
		await browser.close();
	}
};
