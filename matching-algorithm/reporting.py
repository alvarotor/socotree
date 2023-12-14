'''
Creates a class that saves data for reporting

Classes:

    Reporter
'''
import sys
import datetime


class Reporter:
    def __init__(self, debug=False):
        self.debug = debug

    def format_log(self, text):
        log = f'{datetime.datetime.utcnow()} - {text}'
        return log

    def handling_error(self):
        print('The process found an error')
        print(f'Errortype: {sys.exc_info()[0]}\n - {sys.exc_info()[1]} in line {sys.exc_info()[2].tb_lineno}')

    def info(self, text, d=True, e=False):
        if d:
            text = self.format_log(text)
        if e:
            print(text, end='')
        else:
            print(text)

    def dev_info(self, text, d=True, e=False):
        if self.debug:
            if d:
                text = self.format_log(text)
            if e:
                print(text, end='')
            else:
                print(text)