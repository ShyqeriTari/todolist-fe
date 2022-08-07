import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const SignIn = () => {

    const [username, setUsername] = useState(undefined)
    const [password, setPassword] = useState(undefined)

    const router = useRouter();

    const userRegister = async (e) => {

        const User = { username, password }
        try {
            let response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/user/register`, {
                method: "POST",
                body: JSON.stringify(User),
                headers: {
                    "Content-type": "application/json",
                },
            })
            if (response.ok) {
                let data = await response.json()
                console.log(data)
                localStorage.setItem("token", data.accessToken)
                localStorage.setItem("userId", data.user)
                router.push("/Home")
                setRender(true)
            } else {
                alert("registration failed")
                if (response.status === 400) {
                    alert("bad request")
                }
                if (response.status === 404) {
                    alert("page not found")
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="m-auto text-center border-container mt-5">
            <div className="flex flex-col">
                <h3 className="mt-3 text-blue-600">Sign Up</h3>
                <input type="text" placeholder="Insert username..." onChange={(e) => { setUsername(e.target.value) }} required className="w-70 m-auto mt-3 border-blue-600 border p-1" />
                <input type="password" placeholder="Insert password..." onChange={(e) => { setPassword(e.target.value) }} required className="w-70 m-auto mt-2 border-blue-600 border p-1" />
                <button className="mt-3 mb-2 m-auto border-container bg-blue-600 text-white" onClick={(e) => { userRegister(e) }} >Submit</button>
                <span className="mb-3 text-blue-600"> <Link href="/" > Already registered?  Sign In here</Link></span>
            </div>
        </div>
    );
}

export default SignIn;