import os
import sys

# Allow importing model_eval from the project root
_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
if _ROOT not in sys.path:
    sys.path.insert(0, _ROOT)

UPLOAD_PATH = os.path.abspath(os.path.expanduser("~/Downloads/UPLOADED_IMAGE.jpg"))

# Short topic labels matching the frontend
_LABELS = [
    "Road Defect",
    "Fallen Tree / Branches",
    "Pothole",
    "Flooding",
    "Broken Streetlight",
]

def classify_image(image_path=None):
    """Run all 5 Roboflow workflows and return the highest-confidence short label.
    Returns None if nothing is detected confidently enough.
    """
    from inference_sdk import InferenceHTTPClient

    uploaded = image_path or UPLOAD_PATH

    client = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com",
        api_key="u9syXdrvnXjWalaL0myP",
    )

    workflow_ids = [
        "text-recognition-road-defect",
        "text-recognition-fallen-trees",
        "text-recognition-pothole",
        "text-recognition-flooding",
        "text-recognition-broken-lights",
    ]

    results = []
    for wid in workflow_ids:
        try:
            res = client.run_workflow(
                workspace_name="hackhive",
                workflow_id=wid,
                images={"image": uploaded},
                use_cache=True,
            )
            results.append(res)
        except Exception:
            results.append([{}])

    max_index = -1
    max_conf = float("-inf")

    for i, model_result in enumerate(results):
        try:
            conf = (
                model_result[0]["predictions"]["predictions"][0]["confidence"]
            )
            if conf and conf > max_conf:
                max_conf = conf
                max_index = i
        except (IndexError, KeyError, TypeError):
            continue

    if max_index >= 0:
        return _LABELS[max_index]
    return None
