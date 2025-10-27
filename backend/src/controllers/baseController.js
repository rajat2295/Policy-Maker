import Survey from "../models/Survey.js";
export const getData = async (req, res) => {
  try {
    const surveys = await Survey.find();
    // res.status(200).json(survey  s);
    res.json({ status: "success", surveys });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
    console.error("Error fetching surveys:", error);
  }
};
export const postData = (req, res) => {
  const receivedData = req.body;
  res.status(201).send("Data created successfully");
  console.log("Received data:", receivedData);
  res.json({ status: "success", receivedData });
};
export const putData = (req, res) => {
  const updatedData = req.body;
  res.status(200).send("Data updated successfully");
  console.log("Updated data:", updatedData);
  res.json({ status: "success", updatedData });
};
export const deleteData = (req, res) => {
  const { id } = req.params;
  res.status(200).send(`Data with id ${id} deleted successfully`);
  console.log(`Deleted data with id: ${id}`);
  res.json({ status: "success", id });
};
