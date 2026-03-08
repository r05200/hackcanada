from numpy import inf

# 1. Import the library
from inference_sdk import InferenceHTTPClient

# 2. Connect to your workflow 1
client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="jFwyMz8yRQbXhLuPKbc4"
)

uploaded = "Downloads/UPLOADED_IMAGE.jpg"

# 3. Run your workflow on an image
model1 = client.run_workflow(
    workspace_name="ryes-workspace",
    workflow_id="text-recognition-road-defect",
    images={
        "image": uploaded # Path to your image file
    },
    use_cache=True # Speeds up repeated requests
)

model2 = client.run_workflow(
    workspace_name="ryes-workspace",
    workflow_id="text-recognition-fallen-trees",
    images={
        "image": uploaded # Path to your image file
    },
    use_cache=True # Speeds up repeated requests
)

model3 = client.run_workflow(
    workspace_name="ryes-workspace",
    workflow_id="text-recognition-pothole",
    images={
        "image": uploaded # Path to your image file
    },
    use_cache=True # Speeds up repeated requests
)

# 2. Connect to your workflow 2
client2 = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com/",
    api_key="u9syXdrvnXjWalaL0myP"
)

model4 = client2.run_workflow(
    workspace_name="hackhive",
    workflow_id="text-recognition-flooding",
    images={
        "image": uploaded # Path to your image file
    },
    use_cache=True # Speeds up repeated requests
)

model5 = client2.run_workflow(
    workspace_name="hackhive",
    workflow_id="text-recognition-broken-lights",
    images={
        "image": uploaded # Path to your image file
    },
    use_cache=True # Speeds up repeated requests
)

models = [model1, model2, model3, model4, model5] 

max_index = 0
max_result = -inf

for i in range(models):
    if models[i][0]["predictions"]['predictions'][0]["confidence"] > max_result:
        max_index = i
        max_result = models[i][0]["predictions"]['predictions'][0]["confidence"]

if(max_index == 0):
    print("Road defect detected")
elif(max_index == 1):
    print("Fallen trees/branches detected")
elif (max_index == 2):
    print("Pothole detected")
elif (max_index == 3):
    print("Flooding detected")
else:
    print("Inadequate lighting detected")