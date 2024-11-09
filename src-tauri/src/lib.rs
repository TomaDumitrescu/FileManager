use std::fs;
use std::path::{Path};

#[tauri::command]
fn list_files(target_path: String) -> Vec<String> {
	let current_path = Path::new(&target_path);

	let mut files = Vec::<String>::new();

	if !current_path.is_dir() {
		files.push(target_path.clone());
		return files;
	}

	let _ = match fs::read_dir(current_path) {
		Err(_err) => { () },
		Ok(dirs) => for dir in dirs {
			let dpath = dir.unwrap().path();
			let fname_opt = dpath.file_name()
			.and_then(|fname| fname.to_str())
			.map(|fstr| fstr.to_string());

			match fname_opt {
				Some(fname_string) => {
					files.push(fname_string);
				},
				None => (),
			}
		},
	};

	files
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![list_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
