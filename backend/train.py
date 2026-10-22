"""
EfficientNet-B0 Training Script for PlantVillage Dataset
FarmerFriend AI Crop Disease Detection
======================================================
Usage:
    python train.py --data_dir /path/to/plantvillage_dataset --epochs 10 --batch_size 32
"""

import os
import sys
import argparse
import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms

def parse_args():
    parser = argparse.ArgumentParser(description="Train EfficientNet-B0 on PlantVillage")
    parser.add_argument("--data_dir", type=str, required=True, help="Path to PlantVillage root directory containing class folders")
    parser.add_argument("--epochs", type=int, default=10, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size for training")
    parser.add_argument("--lr", type=float, default=1e-3, help="Initial learning rate")
    parser.add_argument("--val_split", type=float, default=0.2, help="Validation split fraction (default: 0.2)")
    parser.add_argument("--output_path", type=str, default="./models/plant_disease_effnet_b0.pth", help="Path to save weights")
    return parser.parse_args()

def main():
    args = parse_args()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[*] Training on device: {device}")

    if not os.path.isdir(args.data_dir):
        print(f"[!] Error: Data directory '{args.data_dir}' not found.")
        sys.exit(1)

    # 1. Data Augmentations and Transforms
    train_transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # 2. Dataset Loading
    full_dataset = datasets.ImageFolder(args.data_dir, transform=train_transform)
    num_classes = len(full_dataset.classes)
    print(f"[*] Found {len(full_dataset)} images across {num_classes} classes.")

    # Save class mapping
    os.makedirs(os.path.dirname(args.output_path), exist_ok=True)
    classes_json_path = os.path.join(os.path.dirname(args.output_path), "class_names.json")
    with open(classes_json_path, "w") as f:
        json.dump(full_dataset.classes, f, indent=2)
    print(f"[*] Exported class index mapping to: {classes_json_path}")

    val_size = int(len(full_dataset) * args.val_split)
    train_size = len(full_dataset) - val_size
    train_set, val_set = random_split(full_dataset, [train_size, val_size])

    train_loader = DataLoader(train_set, batch_size=args.batch_size, shuffle=True, num_workers=2, pin_memory=True if device.type == 'cuda' else False)
    val_loader = DataLoader(val_set, batch_size=args.batch_size, shuffle=False, num_workers=2)

    # 3. Model Definition - EfficientNet-B0 Pretrained
    print("[*] Initializing Pretrained EfficientNet-B0 backbone...")
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3, inplace=True),
        nn.Linear(in_features, num_classes)
    )
    model.to(device)

    # 4. Loss, Optimizer, and Scheduler
    criterion = nn.CrossEntropyLoss(label_smoothing=0.1)
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=1e-2)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs, eta_min=1e-6)

    # 5. Training Loop
    best_val_acc = 0.0

    for epoch in range(1, args.epochs + 1):
        model.train()
        running_loss = 0.0
        correct_train = 0
        total_train = 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, preds = torch.max(outputs, 1)
            correct_train += torch.sum(preds == labels.data).item()
            total_train += labels.size(0)

        scheduler.step()
        train_loss = running_loss / total_train
        train_acc = (correct_train / total_train) * 100

        # Validation
        model.eval()
        val_loss = 0.0
        correct_val = 0
        total_val = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                outputs = model(images)
                loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)
                _, preds = torch.max(outputs, 1)
                correct_val += torch.sum(preds == labels.data).item()
                total_val += labels.size(0)

        val_loss = val_loss / total_val
        val_acc = (correct_val / total_val) * 100

        print(f"Epoch [{epoch:02d}/{args.epochs:02d}] "
              f"Train Loss: {train_loss:.4f} | Train Acc: {train_acc:.2f}% | "
              f"Val Loss: {val_loss:.4f} | Val Acc: {val_acc:.2f}%")

        # Save Best Model Checkpoint
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), args.output_path)
            print(f"  --> Saved new best checkpoint to {args.output_path} (Val Acc: {val_acc:.2f}%)")

    print("\n[✓] Training Complete!")
    print(f"[✓] Final Best Model Saved: {args.output_path}")
    print("    You can now start or restart the FastAPI backend to use this trained model.")

if __name__ == "__main__":
    main()
