import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";


const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto p-2'>
			<div className=' w-full p-6 bg-gray-400 bg-clip-padding backdrop-filter bg-opacity-0'>
			<h1 className='text-7xl text-green-900 text-right font-login mr-[25rem] mb-[3rem] absolute'>
					Sign Up 
				</h1>

				<form onSubmit={handleSubmit} className="ml-[20rem] ">
					<div>
						<input
							type='text'
							placeholder='Name'
							className='w-full input input-bordered h-10 mb-[2rem] border-0 text-xl pl-[2rem] pt-[0.2rem] pb-[0.2rem] font-login'
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
					</div>

					<div>
						<input
							type='text'
							placeholder='Username'
							className='w-full input input-bordered h-10 mb-[2rem] border-0 text-xl pl-[2rem] pt-[0.2rem] pb-[0.2rem] font-login'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
					</div>

					<div>
						<input
							type='password'
							placeholder='Password'
							className='w-full input input-bordered h-10 mb-[2rem] border-0 text-xl pl-[2rem] pt-[0.2rem] pb-[0.2rem] font-login'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
					</div>

					<div>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full input input-bordered h-10 mb-[2rem] border-0 text-xl pl-[2rem] pt-[0.2rem] pb-[0.2rem] font-login'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>

					<GenderCheckbox onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />

					<Link
						to={"/login"}
						className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block font-login'
						href='#'
					>
						Already have an account?
					</Link>

					<div>
						<button className='rounded-2xl hover:bg-green-800 btn-block bg-green-900 text-white text-lg btn-sm mt-2 font-login' disabled={loading}>
							{loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;