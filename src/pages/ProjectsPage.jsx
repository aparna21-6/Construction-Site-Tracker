//import { useAuth } from "../context/AuthContext";
//import { Link } from "react-router-dom";

//function ProjectsPage() {
  //const { currentUser, logout } = useAuth();

  //return (
    //<div className="min-h-screen bg-gray-100 p-6">
      //<div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        //<h1 className="text-3xl font-bold mb-4">Projects Dashboard</h1>

        //<p className="text-lg">Welcome, {currentUser?.username}</p>
        //<p className="text-gray-600">Email: {currentUser?.email}</p>
        //<p className="mt-2 font-semibold text-blue-600">
          //Role: {currentUser?.role}
        //</p>

        //{currentUser?.role === "admin" && (
          //<Link
            //to="/admin"
            //className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
          //>
            //Go to Admin Panel
          //</Link>
        //)}

        //<div className="mt-8 border-t pt-6">
          //<h2 className="text-xl font-semibold mb-2">Current Project Status</h2>
          //<ul className="list-disc pl-5 text-gray-700 space-y-1">
            //<li>Authentication working</li>
            //<li>Protected routes added</li>
            //<li>Role-based access in //progress</li>
            ////<li>Dashboard and cards to be added next</li>
          //</ul>
        //</div>

        //<button
         // onClick={logout}
          //className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg"
        //>
          //Logout
        //</button>
      //</div>
    //</div>
  //);
//}

//export default ProjectsPage;