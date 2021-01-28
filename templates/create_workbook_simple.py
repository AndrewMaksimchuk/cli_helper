# 
# 
import os
from openpyxl import *
from excel_styles import *
from create_excel_file_templates import *
import tools

helps = tools.Showcase_tools()
# Номер групи ""
id_of_group = ""

temp = helps.get_available_goods_from_group(id_of_group)
print(temp)

file_name = ""
create_workbook_simple(__file__, helps, temp, file_name)

cwd = os.path.abspath(__file__)
helps.zip_archive(cwd)