import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    DeleteCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS"
    };

    try {

        // OPTIONS
        if (event.requestContext?.http?.method === "OPTIONS") {
            return {
                statusCode: 200,
                headers,
                body: ""
            };
        }

        // GET /activities
        if (
            event.requestContext?.http?.method === "GET" &&
            event.rawPath === "/activities"
        ) {

            const email =
    event.queryStringParameters?.email;

const result = await ddb.send(
    new ScanCommand({
        TableName: "ReserveTracker"
    })
);

const filteredItems =
    result.Items.filter(
        item => item.email === email
    );

return {
    statusCode: 200,
    headers,
    body: JSON.stringify(filteredItems)
};
        }

        // POST /activity
        if (
            event.requestContext?.http?.method === "POST" &&
            event.rawPath === "/activity"
        ) {

            const body = JSON.parse(event.body);
            console.log("BODY RECEIVED:", body);
            console.log(body);

            const item = {
                soldierId: Date.now().toString(),
                email: body.email,
                date: body.date,
                unit: body.unit,
                activity: body.activity,
                days: Number(body.days)
            };

            await ddb.send(
                new PutCommand({
                    TableName: "ReserveTracker",
                    Item: item
                })
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    message: "Activity saved",
                    item
                })
            };
        }

        // DELETE /activity/{id}
        if (
            event.requestContext?.http?.method === "DELETE"
        ) {

            console.log("EVENT:", JSON.stringify(event));

            const id =
                event.pathParameters?.id ||
                event.pathParameters?.["id"] ||
                event.rawPath.split("/").pop();

            console.log("EVENT =", JSON.stringify(event));
            console.log("ID =", id);
            console.log(JSON.stringify(event));
            console.log("ID =", id);

            console.log("DELETE ID:", id);

            await ddb.send(
                new DeleteCommand({
                    TableName: "ReserveTracker",
                    Key: {
                        soldierId: String(id)
                    }
                })
            );

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    message: "Deleted",
                    id
                })
            };
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({
                message: "Not Found"
            })
        };

    } catch (error) {

        console.log("ERROR:", error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
    // test ci cd
};
