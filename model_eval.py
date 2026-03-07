# Check highest confidence rate

from numpy import inf

# 1. Import the library
from inference_sdk import InferenceHTTPClient

# 2. Connect to your workflow
client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="jFwyMz8yRQbXhLuPKbc4"
)

# 3. Run your workflow on an image
model1 = client.run_workflow(
    workspace_name="ryes-workspace",
    workflow_id="road-defect-resnet",
    images={
        "image": "YOUR_IMAGE.jpg" # Path to your image file
    },
    use_cache=True # Speeds up repeated requests
)

# ADD MODEL 2,3,4,5

models = [model1, model2, model3, model4, model5] 

max_index = 0
max_result = -inf

for i in range(models):
    if models[i] > max_result:
        max_index = i
        max_result = models[i]

print(models[max_index])