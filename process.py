import os
import numpy as np
from vision_agent.tools import *
from typing import *
from pillow_heif import register_heif_opener
register_heif_opener()
import vision_agent as va
from vision_agent.tools import register_tool

from vision_agent.tools import extract_frames_and_timestamps, owl_v2_video
import numpy as np


def count_people_entering_mall(video_path):
    # Extract frames from the video
    frames_with_timestamps = extract_frames_and_timestamps(video_path, fps=1)
    frames = [f["frame"] for f in frames_with_timestamps]

    # Use owl_v2_video to detect people in each frame
    detections = owl_v2_video("person", frames, box_threshold=0.1)

    total_entered = 0
    current_occupancy = 0
    previous_detections = set()

    for frame_detections in detections:
        current_detections = set()
        frame_height = frames[0].shape[0]
        frame_width = frames[0].shape[1]

        for detection in frame_detections:
            if detection['score'] >= 0.15:  # Filter low confidence detections
                # Get the bottom center of the bounding box
                x_center = (detection['bbox'][0] + detection['bbox'][2]) / 2
                y_bottom = detection['bbox'][3]

                # Check if the person is in the lower half of the frame
                if y_bottom > 0.5:
                    # Unnormalize coordinates
                    x_pixel = int(x_center * frame_width)
                    y_pixel = int(y_bottom * frame_height)
                    
                    current_detections.add((x_pixel, y_pixel))

        # Count new detections
        new_detections = current_detections - previous_detections
        total_entered += len(new_detections)
        current_occupancy = len(current_detections)

        previous_detections = current_detections

    return total_entered, current_occupancy

def get_mall_occupancy():
    _, current_occupancy = count_people_entering_mall("4750076-sd_960_540_25fps.mp4")
    capacity = 1000
    over_capacity = max(0, current_occupancy - capacity)
    return current_occupancy, over_capacity

# Example usage
total_entered, current_occupancy = count_people_entering_mall("4750076-sd_960_540_25fps.mp4")
print(f"Number of people entered the mall: {total_entered}")
print(f"Current occupancy: {current_occupancy}")

current_occupancy, over_capacity = get_mall_occupancy()
print(f"Current occupancy: {current_occupancy}")
print(f"Number of people over capacity: {over_capacity}")

