// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function httpInvoke(url: string, prms?: unknown): Promise<any> {
    const req: RequestInit = {
        method: "GET",
    }
    if (prms !== null) {
        const json = JSON.stringify(prms)
        req.method = "POST"
        req.headers = { "Content-Type": "application/json" }
        req.body = json
    }
    const res = await fetch(url, req)
    const resObj = await res.json()
    return resObj
}
