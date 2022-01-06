//NPM packages
const ejs = require("ejs");
const express = require("express");
const passport = require("passport");
const MongoStore = require('connect-mongo');
const { MessageEmbed, WebhookClient } = require("discord.js");
const Strategy = require("passport-discord").Strategy;
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const moment = require('moment');
const path = require("path");
const session = require('express-session');
const url = require("url");
const partials = require('express-partials');

//Local Files
const Webhooks = require("./Config/webhooks.json");
const { clientID, secret: clientSecret, mongoDB } = require("../config.json");

//Strings
const domain = "http://localhost:4321";
const secret = clientSecret;

//Other
const loginLogs = new WebhookClient({ url: Webhooks.login });
const config = {
    "verification": "",
    "description": "Slash Link is a url shortner for any url!", //description
    "https": "https://", // leave as is
    "port": "5003",
}

const app = express();
app.use(express.static(__dirname + '/static'));

module.exports = async (client) => {
    const dataDir = path.resolve(`${process.cwd()}${path.sep}Site`);

    const templateDir = path.resolve(`${dataDir}${path.sep}templates`);


    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));


    passport.use(new Strategy({
        clientID: `${clientID}`,
        clientSecret: `${secret}`,
        callbackURL: `${domain}/callback`,
        scope: ["identify", "guilds"]
    },
        (accessToken, refreshToken, profile, done) => {

            process.nextTick(() => done(null, profile));
        }));

    app.use(session({
        secret: 'gkagsahdgijgijmsagoimig',
        resave: true,
        saveUninitialized: true,
        store: MongoStore.create({ mongoUrl: mongoDB })
    }));


    // We initialize passport middleware.
    app.use(passport.initialize());
    app.use(passport.session());
    app.set('views', path.join(__dirname, 'templates'));

    app.use(partials()); //https://stackoverflow.com/a/22543370/15751555

    app.locals.domain = domain.split("//")[1];
    app.engine("html", ejs.renderFile);
    app.set("view engine", "html");

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    const renderTemplate = async (res, req, template, data = {}) => {
        var hostname = req.headers.host;
        var pathname = url.parse(req.url).pathname;
        const bots = await require("../models/bot").find({ userID: req.user.id });
        const botArr = []
        for(const bot of bots){
            const BotUsr = await client.users.fetch(bot.botID);
            let MGuild;
            for(let guild of await (await client.guilds.fetch()).values()){
                guild = await guild.fetch();
                if(await (await guild.members.fetch(BotUsr.id)) != null){
                    MGuild = await guild.members.fetch(BotUsr.id)
                }
            }
            const dataB = Object.assign(bot, { userReal: BotUsr, MGuild });
            botArr.push(dataB)
        }
        const baseData = {
            https: "https://",
            domain: domain,
            client: client,
            hostname: hostname,
            pathname: pathname,
            path: req.path,
            user: req.isAuthenticated() ? req.user : null,
            verification: config.verification,
            description: config.description,
            url: res,
            req: req,
            image: `${domain}/logo.png`,
            name: client.user.username,
            tag: client.user.tag,
            redirect: function(place){
                res.redirect(place);
            },
            userBots: botArr,
            util: require("../utils/index")
        };
        res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
    };

    const checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    }

    // Login endpoint.
    app.get("/login", (req, res, next) => {
        res.render
        if (req.session.backURL) {
            req.session.backURL = req.session.backURL;

        } else if (req.headers.referer) {

            const parsed = url.parse(req.headers.referer);
            if (parsed.hostname === app.locals.domain) {
                req.session.backURL = parsed.path;
            }


        } else {
            req.session.backURL = "/";
        }
        // Forward the request to the passport middleware.
        next();
    },
        passport.authenticate("discord"));

    // Callback endpoint.
    app.get("/callback", passport.authenticate("discord", {
        failWithError: true,
        failureFlash: "There was an error logging you in!",
        failureRedirect: "/",
    }), async (req, res) => {

        try {

            if (req.session.backURL) {

                const url = req.session.backURL;
                req.session.backURL = null;
                res.redirect(url);

                const member = await client.users.fetch(req.user.id);
                if (member) {

                    const login = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`Login Logs`)
                        .setDescription(`\nUser: ${member.tag}\`(${member.id})\`\nTime: ${moment(new Date()).format("dddd, MMMM Do YYYY HH:mm:ss")} `);

                    loginLogs.send({
                        username: 'Login Logs',
                        avatarURL: `${domain}/logo.png`,
                        embeds: [login]
                    });
                }

            } else {

                const member = await client.users.fetch(req.user.id);
                if (member) {

                    const login = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`Login Logs`)
                        .setDescription(`\nUser: ${member.tag}\`(${member.id})\`\nTime: ${moment(new Date()).format("dddd, MMMM Do YYYY HH:mm:ss")} `);

                    loginLogs.send({
                        username: 'Login Logs',
                        avatarURL: `${domain}/logo.png`,
                        embeds: [login]
                    });
                }

                res.redirect("/");
            }
        } catch (err) {

            res.redirect('/')
        }

    });

    // Logout endpoint.
    app.get("/logout", async function (req, res) {
        
        if (req.user) {
            const member = await client.users.fetch(req.user.id);
            if (member) {
                const logout = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(`Logout Logs`)
                    .setDescription(`\nUser: ${member.tag}\`(${member.id})\`\nTime: ${moment(new Date()).format("dddd, MMMM Do YYYY HH:mm:ss")} `);

                loginLogs.send({
                    username: 'Logout Logs',
                    avatarURL: `${domain}/logo.png`,
                    embeds: [logout]
                });
            }
        }


        req.session.destroy(() => {
            req.logout();
            res.redirect("/");
        });
    });

    app.get("/", async (req, res) => {
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        await renderTemplate(res, req, "index.ejs", {
            urlSite: fullUrl
        });
    });

    app.get("/dashboard", async (req, res) => {
        await renderTemplate(res, req, "dashboard.ejs", {});
    });

    app.get("/invite", async (req, res) => {
        res.redirect(`https://discord.com/api/oauth2/authorize?client_id=928073786035687454&permissions=280576&redirect_uri=https%3A%2F%2Fblink.trtle.xyz%2Flogin&response_type=code&scope=identify%20guilds%20applications.commands%20bot`)
    });

    app.listen(4321, null, null, () => console.log(`Dashboard is up and running on port 4321`));
}