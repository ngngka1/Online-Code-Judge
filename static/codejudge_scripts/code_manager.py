from base.settings import STATIC_URL
def parse_input_script(code: str, template_path: str, target_snippet_path: str):
    """This function parses the input code and write them into the input script file

    Args:
        code (str): raw code input
        template_path (str): path to the input template
        target_snippet_path (str): path to the actual input code snippet that is to be executed
    """
    with open(STATIC_URL + template_path, "r") as template_file:
        template = template_file.read()
        indent = ' ' * 4
        code = '\n' + indent + code.replace('\n', '\n' + indent)
        with open(STATIC_URL + target_snippet_path, "w") as snippet_file:
            snippet_file.write(template + code)