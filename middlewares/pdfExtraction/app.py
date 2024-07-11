import os
import PyPDF2
import re
import json

def extract_data_from_pdf(pdf_path):
    try:
        # Open the PDF file
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            page = reader.pages[0]
            text = page.extract_text()

        # Extract information using regular expressions
        name_match = re.search(r'Name of Student\s*:\s*(.+)', text, re.IGNORECASE)
        name = name_match.group(1).strip() if name_match else "Name not found"

        prn_match = re.search(r'PRN\s*:\s*(\d+)', text, re.IGNORECASE)
        prn = prn_match.group(1) if prn_match else "PRN not found"

        sgpa_match = re.search(r'SGPA\s*:\s*([\d.]+)', text, re.IGNORECASE)
        sgpa = sgpa_match.group(1) if sgpa_match else "SGPA not found"

        cgpa_match = re.search(r'CGPA\s*:\s*([\d.]+)', text, re.IGNORECASE)
        cgpa = cgpa_match.group(1) if cgpa_match else "CGPA not found"

        percentage_match = re.search(r'Percentage\s*:\s*([\d.]+)', text, re.IGNORECASE)
        percentage = percentage_match.group(1) if percentage_match else "Percentage not found"

        result_match = re.search(r'Result\s*:\s*(PASS|FAIL)', text, re.IGNORECASE)
        result = result_match.group(1) if result_match else 'Result not found'

        total_match = re.search(r'Grand Total \(OUT OF1550 \):\s*(\d+)', text, re.IGNORECASE)
        total = total_match.group(1) if total_match else "Total not found"

        # Create a dictionary with extracted data
        data_dict = {
            # "Name": name,
            "StudentID": prn,
            # "SGPA": sgpa,
            "CGPA": cgpa,
            "percentage": percentage,
            "resultStatus": result,
            "Marks_Obtained": total
        }

        return data_dict
    except Exception as e:
        print(f"Error occurred while processing PDF: {e}")
        return None

def save_data_to_json(data_dict, output_path):
    try:
        # Convert dictionary to JSON format
        data_json = json.dumps(data_dict, indent=4)

        # Open the file in write mode and save the JSON data
        with open(output_path, 'w') as output_file:
            output_file.write(data_json)

        print(f"Data saved to: {output_path}")
    except Exception as e:
        print(f"Error occurred while saving data to JSON: {e}")

if __name__ == "__main__":
    # Get the directory path for PDF files
    pdf_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../public/temp")

    # Iterate over files in the directory
    for filename in os.listdir(pdf_directory):
        if filename.endswith(".pdf"):
            # Construct the full path of the PDF file
            pdf_path = os.path.join(pdf_directory, filename)

            # Extract data from PDF
            data = extract_data_from_pdf(pdf_path)

            if data:
                # Define the filename for the output JSON file
                output_filename = "data_output.json"

                # Define the full path of the output file
                output_path = os.path.join(os.path.dirname(pdf_path), output_filename)

                # Save data to JSON
                save_data_to_json(data, output_path)
                break  # Exit loop after processing the first PDF file
    else:
        print("No PDF files found in the directory.")





# import os
# import PyPDF2
# import re
# import json

# # Get the current directory of the script (middleware/app.py)
# current_directory = os.path.dirname(os.path.abspath(__file__))

# # Define the relative path to the temp folder inside the public folder
# pdf_directory = os.path.join(current_directory, "../../public/temp")

# # PDF file name
# pdf_filename = "_Provisional_Grade_Card.pdf"

# # Define the full path of the PDF file
# pdf_path = os.path.join(pdf_directory, pdf_filename)

# # Open the PDF file
# with open(pdf_path, 'rb') as file:
#     reader = PyPDF2.PdfReader(file)
#     page = reader.pages[0]
#     text = page.extract_text()

# # Extract information using regular expressions
# name_match = re.search(r'Name of Student\s*:\s*(.+)', text, re.IGNORECASE)
# name = name_match.group(1).strip() if name_match else "Name not found"

# prn_match = re.search(r'PRN\s*:\s*(\d+)', text, re.IGNORECASE)
# prn = prn_match.group(1) if prn_match else "PRN not found"

# sgpa_match = re.search(r'SGPA\s*:\s*([\d.]+)', text, re.IGNORECASE)
# sgpa = sgpa_match.group(1) if sgpa_match else "SGPA not found"

# cgpa_match = re.search(r'CGPA\s*:\s*([\d.]+)', text, re.IGNORECASE)
# cgpa = cgpa_match.group(1) if cgpa_match else "CGPA not found"

# percentage_match = re.search(r'Percentage\s*:\s*([\d.]+)', text, re.IGNORECASE)
# percentage = percentage_match.group(1) if percentage_match else "Percentage not found"

# result_match = re.search(r'Result\s*:\s*(PASS|FAIL)', text, re.IGNORECASE)
# result = result_match.group(1) if result_match else 'Result not found'

# total_match = re.search(r'Grand Total \(OUT OF775 \):\s*(\d+)', text, re.IGNORECASE)
# total = total_match.group(1) if total_match else "Total not found"

# # Create a dictionary with extracted data
# data_dict = {
#     # "Name": name,
#     "StudentID": prn,
#     # "SGPA": sgpa,
#     "CGPA": cgpa,
#     "percentage": percentage,
#     "resultStatus": result,
#     "Marks_Obtained": total
# }

# # Convert dictionary to JSON format
# data_json = json.dumps(data_dict, indent=4)

# # Define the filename for the output JSON file
# output_filename = "data_output.json"

# # Define the full path of the output file
# output_path = os.path.join(current_directory, output_filename)
# print(output_path)

# # Open the file in write mode and save the JSON data
# with open(output_path, 'w') as output_file:
#     output_file.write(data_json)

# print(f"Data saved to: {output_path}")
