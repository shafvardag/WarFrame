import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  let Router = useRouter();

  async function HandleSubmit(e) {
    e.preventDefault();
    if (name === "" || email === "" || password === "") {
      return alert("please Give complete Data") && null;
    }
    setErrorMessage("")
    try {
      const resUserExists = await fetch("/api/registration/findUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { UserExists } = await resUserExists.json();

      if (UserExists) {
        setErrorMessage("User Already Exsists");
        return;
      }


      const res = await fetch("/api/registration/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role:1 }),
      });

      console.log("fetch portion work perfectly");
      if (res.status === 200) {
        console.log("User Register Successfully");
        setErrorMessage("");
        Router.push("/login");
      } else {
        const data = await res.json();
        console.log("Please Give Correct Credentials");
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.log("error while fetch", error);
    }
  }
  function routeToReg() {
    Router.push("/login");
  }
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>
          <form onSubmit={HandleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Name</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required placeholder="Password"/>
            </div>
            {errorMessage && (
              <p className="text-xl text-black font-semibold ">{errorMessage}</p>
            )}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
              </div>
            </div>
            <button type="submit" className="w-full text-black bg-purple-300 hover:bg-purple-400 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create an account</button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account? <span onClick={routeToReg} className="font-medium cursor-pointer text-primary-600 hover:underline dark:text-primary-500">Login here</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
  );
}