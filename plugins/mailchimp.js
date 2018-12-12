const {
    Route
} = require('@origami/core');
const request = require('request-promise-native');

module.exports = (app, options) => {
    const {
        apiKey,
        listId
    } = options;
    if (!apiKey) throw new Error('"apiKey" is required for the Mailchimp plugin');
    if (!listId) throw new Error('"listId" is required for the Mailchimp plugin');

    const dataCenter = options.dataCenter || apiKey.split('-').pop();

    const r = new Route('/subscribe')
        .post(async (req, res, next) => {
            const {
                firstName,
                lastName,
                email
            } = req.body;
            const err = e => {
                const _err = new Error(e);
                _err.statusCode = 400;
                return next(_err);
            }

            if (!firstName) return err('First name is required.');
            if (!lastName) return err('Last name is required.');
            if (!email) return err('Email is required.');

            try {
                const response = await request({
                        method: "post",
                        url: `https://${dataCenter}.api.mailchimp.com/3.0/lists/${listId}/members/`,
                        json: true,
                        body: {
                            "email_address": email,
                            "status": "subscribed",
                            "merge_fields": {
                                "FNAME": firstName,
                                "LNAME": lastName
                            }
                        },
                        auth: {
                            user: 'origami',
                            pass: apiKey
                        }
                    })
                    .catch(err => {
                        let message = err.response.body.detail;
                        if (message.includes('is already a list member')) {
                            message = 'This email is already subscribed.';
                        }
                        const e = new Error(message);
                        e.statusCode = 400;
                        next(e);
                    });

                if (response && response.id) {
                    res.contentType('json');
                    res.locals.content.responseCode = 'Successfully subscribed member';
                }


            } catch (e) {
                next(e);
            }


            next();
        });

    app.useRouter(r);
}
