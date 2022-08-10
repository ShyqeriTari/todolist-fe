import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import validator from "validator";

const SignIn = () => {

    const [username, setUsername] = useState(undefined)
    const [password, setPassword] = useState(undefined)
    const [passwordMessage, setPasswordMessage] = useState(undefined)
    const [inputType, setInputType] = useState("password")
    const [eyeView, setEyeView] = useState(false)

    const router = useRouter();

    const validate = (value) => {
 
        if (validator.isStrongPassword(value, {
          minLength: 8, minLowercase: 1,
          minUppercase: 1, minNumbers: 1, minSymbols: 1
        })) {
          setPasswordMessage('Is Strong Password')
        } else {
          setPasswordMessage('Password is not strong enough')
        }
      }

    const userRegister = async (e) => {
        e.preventDefault();
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
                localStorage.setItem("token", data.accessToken)
                localStorage.setItem("userId", data.user)
                router.push("/Home")
                setRender(true)
            } else {
                if (response.status === 400) {
                    alert("Username already exist, please choose another one")
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
        <h1 className="m-auto text-center text-blue-600 mt-3 mb-3 font-bold">Todolist-challenge</h1>
        <div className="m-auto text-center border-container bg-white mt-5">
            <div className="flex flex-col">
                <h3 className="mt-3 text-blue-600">Sign Up</h3>
                <input type="text" placeholder="Insert username..." onChange={(e) => { setUsername(e.target.value) }} required className="w-70 m-auto mt-3 bg-white border-blue-600 border p-1" />
                <div className="flex justify-center items-center ">
        <input type={inputType} placeholder="Insert password..." onChange={(e) => { validate(e.target.value) ; setPassword(e.target.value) }} required className="w-70 ml-4  bg-white mt-2 border-blue-600 border p-1" />
       { eyeView === false ? <i className="bi bi-eye pointer text-blue-600 ml-1" onClick={()=> {setInputType("text"); setEyeView(!eyeView)}}></i> :  <i className="bi bi-eye-slash pointer text-blue-600 ml-1" onClick={()=> {setInputType("password"); setEyeView(!eyeView)}}></i>}
        </div>
                <label className="text-blue-600 font-light text-sm">Password minimum length is 8 characters and must contain: 
                <ol><li>1 lowercase letter</li>
                <li>1 uppercase letter</li>
                <li>1 number</li>
                <li>1 symbol</li>
                </ol>  </label>
                <button className="mt-2 mb-2 m-auto border-container bg-blue-600 text-white" onClick={(e) => { passwordMessage === 'Is Strong Password'? userRegister(e) : alert(passwordMessage) }} >Submit</button>
                <span className="mb-3 text-blue-600"> <Link href="/" > Already registered?  Sign In here</Link></span>
            </div>
        </div>
        </>
    );
}

export default SignIn;