import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from "aws-lambda";

type FunctionHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;

export const handler: FunctionHandler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ hello: "world" })
    }
}