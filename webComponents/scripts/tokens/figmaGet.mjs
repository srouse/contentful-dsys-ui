import 'dotenv/config'
import axios from "axios";


export default async function figmaGet(
    endpoint
) {
    let axiosConfig = {};
    if (process.env.https_proxy) {
        const url = new URL(process.env.https_proxy);
        axiosConfig.proxy = {
            protocol: 'https',
            host: url.hostname,
            port: url.port
        }
    }

    return axios.get(
        "https://api.figma.com/v1/files/" + process.env.FIGMA_FILE_KEY + "/" + endpoint,
        {
            ...axiosConfig,
            headers: {
                accept: "*                   /*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "x-figma-token": process.env.FIGMA_TOKEN,
            },
            referrer: "https://www.figma.com/",
            referrerPolicy: "origin-when-cross-origin",
            body: null,
            method: "GET",
            mode: "cors",
            credentials: "omit",
        }
    )
        .then((figmaSource) => {
            return figmaSource.data;
        })
        .catch(err => console.error(err));

}
