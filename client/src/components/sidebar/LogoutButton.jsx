/* eslint-disable no-unused-vars */
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";
import { RiLogoutCircleRLine } from "react-icons/ri";
const LogoutButton = () => {

	const {loading,logout}= useLogout()


	return (
		<div className='ml-[12rem] mt-[8rem]'>
			{!loading ? (
				<div className='flex gap-2' >
					Logout
				<RiLogoutCircleRLine className='w-6 h-6 text-emerald-800 cursor-pointer' onClick={logout} />
				
				</div>
			) : (
				<span className='loading loading-spinner'></span>
			)}
		</div>
	);
};
export default LogoutButton;