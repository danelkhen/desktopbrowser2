import { RequestHandler } from "express"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleServiceRequest(service: any) {
    const x: RequestHandler = async (req, res) => {
        const action = req.params["action"]

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let arg: any
        if (req.method === "POST") arg = req.body
        else if (req.query.p !== null) arg = JSON.parse(req.query.p as string)
        else arg = req.query
        console.log(action, req.params, req.query)
        try {
            const result = await service[action!](arg)
            res.json(result ?? null)
        } catch (e) {
            console.log("api action error", e)
            res.status(500).json({ err: e?.toString() }) ///
        }
    }
    return x
}
