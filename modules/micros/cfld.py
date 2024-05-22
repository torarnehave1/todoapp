import os

# Define the directory and file structure
structure = {
    "src": {
        "config": [
            "appwriteConfig.js"
        ],
        "services": [
            "client.js",
            "accountService.js",
            "databaseService.js"
        ],
        "utils": [
            "csvParser.js"
        ],
        "features": {
            "login": [
                "login.js",
                "login.html"
            ],
            "tasks": [
                "tasks.js",
                "tasks.html"
            ],
            "common": [
                "common.js"
            ]
        },
        "index.js": None
    }
}

def create_structure(base_path, structure):
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        if isinstance(content, dict):
            os.makedirs(path, exist_ok=True)
            create_structure(path, content)
        elif isinstance(content, list):
            os.makedirs(path, exist_ok=True)
            for file_name in content:
                open(os.path.join(path, file_name), 'w').close()
        elif content is None:
            open(path, 'w').close()

# Set the base path to the root directory
base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../'))

# Create the folder structure and files
create_structure(base_path, structure)

print("Folder structure and files created successfully.")
