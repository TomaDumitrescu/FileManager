import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
	const [searchedPath, setSearchedPath] = useState("");
	const [outputFiles, setOutputFiles] = useState([]);

	useEffect(()=>{console.log(outputFiles)},[outputFiles])

	async function list_files(path) {
		try {
			setOutputFiles(await invoke("list_files", { targetPath: path }));
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<main className="container">
		<h1>File Manager</h1>

		<div className="row">
		</div>
		<form
			className="row"
			onSubmit={(e) => {
				e.preventDefault();
				list_files(searchedPath);
			}}
		>
			<input
				onChange={(e) => setSearchedPath(e.currentTarget.value)}
			/>
			<button type="submit">Search</button>
		</form>
			<p></p>
			{
				outputFiles.map((file_path) => {
					return <button onClick={(e) => {
						e.preventDefault()
							let newPath = ""
							if (searchedPath[searchedPath.length - 1] != '/')
								newPath = searchedPath + "/" + file_path
							else
								newPath = searchedPath + file_path
							list_files(newPath)
							setSearchedPath(newPath)
						}
					}>
						{file_path}
					</button>
				})
			}
		</main>
	);
}

export default App;
