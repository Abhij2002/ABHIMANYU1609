import { useState, useRef, useEffect} from "react";
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";
import LogoutButton from "../sidebar/LogoutButton";
import { useAuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = () => {
	const { authUser, setAuthUser } = useAuthContext();
	const [showProfile, setShowProfile] = useState(false);
	const fileInputRef = useRef(null);
	const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [groupName, setGroupName] = useState("");
	const [allUsers, setAllUsers] = useState([]);
	const [about, setAbout] = useState("This is a short bio."); // default text
	const [isEditingAbout, setIsEditingAbout] = useState(false);
	const [groups, setGroups] = useState([]);
	useEffect(()=>{
		const fetchGroups = async () =>{
			try {
				const groups = await fetch('api/groups',{credentials:"include"});
				const data = await groups.json();
				setGroups(data);
			} catch (err) {
				console.error("Error fetching users:", err);
			}
		};
		fetchGroups();
	},[]);
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const res = await fetch("/api/users", { credentials: "include" });
				const data = await res.json();
				setAllUsers(data.filter((u) => u._id !== authUser._id));
			} catch (err) {
				console.error("Error fetching users:", err);
			}
		};
		fetchUsers();
	}, []);
	
	
	const handleCreateGroup = async () => {
		if (!groupName || selectedUsers.length < 1) {
			return toast.error("Group must have a name and at least one member");
		}
	
		try {
			const res = await fetch("/api/groups", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					name: groupName,
					members: [...selectedUsers, authUser._id], // include self
				}),
			});
	
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to create group");
	
			toast.success("Group created!");
			setIsCreateGroupModalOpen(false);
			setGroupName("");
			setSelectedUsers([]);
			// Optionally, refetch conversations here
		} catch (err) {
			toast.error(err.message || "Error creating group");
		}
	};
	
	const handleProfilePicClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};
	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("profilePic", file);

		try {
			const res = await fetch("/api/auth/update-profile-pic", {
				method: "PUT",
				body: formData,
				credentials: "include",
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to upload");

			setAuthUser((prev) => ({
				...prev,
				profilePic: data.profilePic,
			}));
			toast.success("Profile picture updated!");
		} catch (err) {
			console.error("Error updating profile picture:", err.message);
			toast.error("Failed to update profile picture");
		}
	};
	

	return (
		<div className="pt-4 pb-4 flex flex-col relative mt-[-0.3rem] ml-[1rem]">
			<img src="3.png" alt="" className="rounded-half absolute mb-3 transition z-20 size-[2.5rem]" />

			{/* Settings/Profile Button */}
			<button
				className="border rounded-full border-black border-2 absolute mb-3 transition z-20 size-[2.5rem] ml-[-0.5rem] mt-[38rem]"
				onClick={() => setShowProfile(!showProfile)}
			>
				<img src={authUser.profilePic} alt="" className="size-[2.3rem] rounded-full object-cover" />
			</button>

			{/* Profile Popup */}
			{showProfile && (
				<div className="absolute top-[18rem] z-40 h-[25rem] w-[20rem] bg-white shadow-lg rounded-md p-4 z-10">
					{/* Clickable profile image */}
					<img
						src={authUser.profilePic}
						alt="Profile"
						className=" rounded-full mb-3 object-cover size-[6rem] ml-2 border border-black "
						/>
					<img src="https://www.shareicon.net/data/512x512/2017/02/09/878599_camera_512x512.png" alt="" 
						onClick={handleProfilePicClick}
						className="size-[2rem] cursor-pointer absolute mt-[-2rem] ml-[4rem] rounded-full"
					/>

					{/* Hidden File Input */}
					<input
						type="file"
						accept="image/*"
						className="hidden"
						ref={fileInputRef}
						onChange={handleFileChange}
					/>

					<p className="text-lg font-bold">{authUser.fullName}</p>
					<p className="text-gray-700">@{authUser.username}</p>
					<p className="text-sm text-gray-500">{authUser.email}</p>

					<button
						className="mt-3 text-emerald-700 hover:text-emerald-800"
						onClick={() => setShowProfile(false)}
					>
						<b className="absolute ml-[17rem] mt-[-11rem] ">X</b>
					</button>
					{/* About Section */}
				<div className="mt-2">
					{isEditingAbout ? (
						<div className="flex items-center space-x-2">
							<input
								type="text"
								value={about}
								onChange={(e) => setAbout(e.target.value)}
								className="border px-2 py-1 rounded w-full text-sm"
							/>
							<button
								onClick={() => setIsEditingAbout(false)}
								className="text-sm px-2 py-1 bg-emerald-600 text-white rounded"
							>
								Save
							</button>
						</div>
					) : (
						<div className="flex justify-between items-center">
							<p className="text-sm text-gray-600 italic">{about || "No about info set."}</p>
							<button
								onClick={() => setIsEditingAbout(true)}
								className="text-xs text-blue-600 hover:underline ml-2"
							>
							<img src="pencil.png" alt="" className="size-[1rem]"/>
							</button>
						</div>
					)}
				</div>

				<button
					onClick={() => setIsCreateGroupModalOpen(true)}
					className="absolute transition z-20 mt-[2rem] pb-1 rounded-[0.5rem] hover:bg-white font-serif bg-gray-200  font-bold-100 border pl-2 pr-2"
				>
					Create Group
				</button>
					<LogoutButton/>
				</div>
			)}
			

{isCreateGroupModalOpen && (
    <div className="absolute z-50 bg-white shadow-lg p-4 rounded w-[20rem] top-[10rem]">
        <h3 className="font-bold mb-2">Create Group</h3>
        <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name"
            className="border border-b-2 border-b-emerald-800 rounded-[0.4rem] p-1 w-full mb-2"
        />
        <div className="h-[10rem] overflow-y-auto mb-2">
            {allUsers.map((user) => (
                <div key={user._id} className="border border-x-0 rounded-[0.2rem] mb-[0.2rem] pl-2 hover:bg-gray-200">
                    <label className="flex items-center space-x-2">
                        <input
							className="absolute ml-[15.5rem] w-4 h-4 peer cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border checked:bg-emerald-800 checked:border-emerald-800"
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() =>
                                setSelectedUsers((prev) =>
                                    prev.includes(user._id)
							? prev.filter((id) => id !== user._id)
							: [...prev, user._id]
						)
					}
                        />
					<span className="flex flex-row p-1"><img src={user.profilePic} alt="" className="size-[2.3rem] mr-[1rem] rounded-full object-cover"/>{user.fullName}</span>
                    </label>
                </div>
            ))}
        </div>
        <button
            onClick={handleCreateGroup}
            className="bg-emerald-800 text-white px-3 py-1 rounded"
        >
            Create
        </button>
        <button
            onClick={() => setIsCreateGroupModalOpen(false)}
            className="ml-2 text-gray-500"
        >
            Cancel
        </button>
    </div>
)}

			<SearchInput />
			<div className="devider px-3"></div>
			<Conversations  groups={groups}/>



		</div>
	);
};

export default Sidebar;
