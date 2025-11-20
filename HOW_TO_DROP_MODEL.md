# How to Convert and Integrate Your ML Model

This guide provides the steps to convert your trained Keras (`.h5`) model to the **TensorFlow.js Graph Model format** and place it correctly within the app for offline inference.

## Step 1: Install the Converter
You will need Python and `pip` installed. In your terminal, run:
`pip install tensorflowjs`

## Step 2: Convert the .h5 Model
The converter tool will create a `model.json` file and one or more `.bin` files. Run the following command from the project's root directory (`cattle-breed-recognizer/`), replacing `path/to/your/model.h5` with the actual path to your Keras model.

`tensorflowjs_converter --input_format=keras server/model/model.h5 app/assets/ml_tfjs/`

## Step 3: Verify the Files
Look inside the `app/assets/ml_tfjs/` directory. You should now see:
- `model.json`
- `group1-shard1of1.bin` (or similar `.bin` files)

The app will automatically find and load these files.
