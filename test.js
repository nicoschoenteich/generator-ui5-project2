// console.log("JSON".split(" ")[0])


const string1 = "http://localhost:4004/some/v4/service"
const string2 = "https://services.odata.org/V4/Northwind/Northwind.svc/"
const serviceUrl = (url) => {
	return new URL(url).pathname
	// return url.split("/")[3]
}
// console.log(serviceUrl(string1))
// console.log(serviceUrl(string2))

const string3 = "/something"
const string4 = "http://localhost:4004/odata/v4/catalog"

console.log(new URL(string4))
