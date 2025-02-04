require('dotenv').config();
const { RestliClient } = require('linkedin-api-client');
const axios = require('axios');

let TOKEN = process.env.token;
exports.token = async (req, res) => {
    if (!TOKEN) {
        return res.status(500).send({ error: 'Token not found in environment variables' });
    }
    res.status(200).send({ token: TOKEN });
}

exports.user = async (req, res) => {
    if (!TOKEN) {
        return res.status(500).send({ error: 'Token not found in environment variables' });
    }
    const restliClient = new RestliClient();
    try {
        let response = await restliClient.get({
            resourcePath: '/userinfo',
            accessToken: TOKEN
        })
        if (!response) throw new Error(`Status: ${response}`);
        return res.status(200).send({ data: response.data })
    } catch (error) {
        return res.status(500).send(error)
    }
}

exports.org = async (req, res) => {
    try {
        const orgName = req.params.key;
        let Org = await getOrganization(orgName);
        const LocId = Array.isArray(Org?.locations) ? Org?.locations[0]?.geoLocation.replace('urn:li:geo:', '') : Org?.locations?.geoLocation.replace('urn:li:geo:', '');
        let geo;
        if (LocId) {
            geo = await getDetail('geo', LocId)
        }
        if (Org) {
            res.status(200).send({ data: Org, loc: geo });
        } else {
            res.status(404).send({ error: "Org Not Found!" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message });
    }
};

async function getOrganization(organizationName) {
    const url = `https://api.linkedin.com/v2/organizations?q=vanityName&vanityName=${organizationName}`;
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        if (!response || !response.data) throw new Error(`Status: ${response.status}, Error: ${response.statusText}`);
        // const urn = response.data.elements[0].id;  // Assuming the first result is the correct one
        // return `urn:li:organization:${urn}`;
        // return urn;
        return response.data.elements[0];
    } catch (error) {
        console.error("Error fetching organization URN:", error.response ? error.response.data : error);
    }
}

// No permission to view other org
async function getDetail(type, id) {
    type = type.toLowerCase();
    try {
        const response = await axios.get(`https://api.linkedin.com/v2/${type}/${id}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        if (!response || !response.data) {
            throw new Error(`No data found. Status: ${response.status}, Error: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error("Error fetching organization:", error.response ? error.response.data : error.message || error);
    }
}
