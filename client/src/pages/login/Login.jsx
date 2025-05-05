import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";


const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className=' flex flex-col items-center justify-center min-w-96 mx-auto p-2'>
			<div className='w-full p-6 bg-gray-400 bg-clip-padding backdrop-filter bg-opacity-0'>
				<h1 className='text-7xl text-green-900 text-right absolute font-login mr-[25rem] mb-[3rem]'>
					Login
					<span className='text-blue-500'> </span>
				</h1>
				

				<form onSubmit={handleSubmit} className="ml-[18rem] mb-[3rem]">
					<div>
						<input
							type='text'
							placeholder='Username'
							className='w-full input input-bordered h-10 mb-[2rem] border-0 text-xl pl-[2rem] pt-[0.2rem] pb-[0.2rem] font-login'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<input
							type='password'
							placeholder='Password'
							className='w-full input input-bordered h-10 mb-[2rem] border-0 text-xl pl-[2rem] pt-[0.2rem] pb-[0.2rem] font-login'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Link to='/signup' className='text-sm font-login hover:underline hover:text-blue-600 mt-2 inline-block'>
						{"Don't"} have an account?
					</Link>

					<div>
						<button className=' rounded-xl hover:bg-green-800 btn-block bg-green-900  text-lg btn-sm mt-2 font-login mt-[2rem] text-white ' disabled={loading}>
							{loading ? <span className='loading loading-spinner '></span> : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;


