import ping from "../utils/ping";
import loc from "../utils/location";
import getTxt from "../utils/txt";

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const { address, version, location, txt } = req.query;

  if (!address || !version)
    return res.status(400).json({
      success: false,
      message: "Bad Request - Address or version not provided",
    });

  const request = await ping(version.toLowerCase(), address.toLowerCase());
  return res.status(200).json(request);
  if (!request || request.error) {
    if (!txt)
      return res.status(200).json({
        success: false,
        error: request.error.message || "Something went wrong",
      });
  }

  if (txt) {
    const getTxtRecords = await getTxt(address);
    request.txt = getTxtRecords;
  }

  if (location) {
    const data = await loc(
      request.srv ? `${request.srv.name}:${request.srv.port}` : address
    );
    request.loc = data;
  }

  return res.status(200).json({ success: true, data: request });
}
