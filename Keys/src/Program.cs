using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace VisualStudioSettings_Keys
{
    class Program
    {
        private const string FilePathCustom = @"..\..\..\VisualStudioSettings_KeysCustom.vssettings";
        private const string FilePathStandard = @"..\..\..\VisualStudioSettings_KeysStandard.vssettings";


        static void Main(string[] args)
        {
            OpenFile(GetSortedLines(FilePathStandard), "sorted.xml");
            OpenFile(GetTableForReadme(FilePathStandard), "table.txt");
        }

        private static void OpenFile(string content, string fileName)
        {
            File.WriteAllText(fileName, content);
            Process.Start(fileName);
        }


        private static string GetSortedLines(string filePath)
        {
            string[] lines = File.ReadAllLines(filePath);
            string[] sortedLines = lines.Where(x => x.Contains("<Shortcut")).OrderBy(x => x).ToArray();
            return string.Join(Environment.NewLine, sortedLines);
        }


        //<Shortcut Command="Edit.CharLeft" Scope="Text Editor">Ctrl+J</Shortcut>

        private static string GetTableForReadme(string filePath)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine("Combination | Command");
            sb.AppendLine("--- | --- ");

            string[] lines = File.ReadAllLines(filePath);

            foreach (var line in lines)
            {
                if (!Regex.IsMatch(line, "<Shortcut"))
                {
                    continue;
                }

                string command = Regex.Matches(line, "\"(.*?)\"")[0].Value.Trim('"');
                string combination = Regex.Matches(line, ">(.*?)<")[0].Value.Trim('>', '<');

                sb.Append($"{combination} | {command}").AppendLine();
            }

            return sb.ToString();
        }

    }
}
