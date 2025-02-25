import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

const apiKey="TqduX5jjZKJeH6R15HqU"
const baseURL = "https://copilotdemolab1.freshdesk.com/api/v2/tickets";


//Fetching tickets
const gettickets = async(): Promise<any> =>{
  if(!apiKey || !baseURL){
    console.error("API key or Base url is missing");
    throw new Error("API key and Base URL not defined");
  }
  const auth=Buffer.from(`${apiKey}:X`).toString('base64');
  const headers={
    'Authorization':`Basic ${auth}`,
    'Accept': 'application/json',
  };

  try{   
    const response = await axios.get(baseURL,{headers});
    return response.data;
  }catch(error){
    console.error("Error Fetching tickets:",error);
    throw new Error("Failed to fetch tickets");
  }
};



/**
 * This function handles the HTTP request and returns the tickets information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the ticket information.
 */
export async function tickets(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  if (req.method === "GET"){
    console.log("GET request Processing");
    try{
      const data=await gettickets();

      return{
        status: 200,
        jsonBody:{
          results:data,
        },
      };
    }catch(error){
      return{
        status: 500,
        jsonBody:{error: "Internal Server Error"},

      };
    }
  }
}

app.http("tickets", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: tickets,
});
