/*=============================
 * Windows API C Cheatsheet
 *=============================*/

 #include <windows.h>
 #include <stdio.h>
 
 //=============================
 // 1. Common Windows Data Types
 //=============================
 DWORD   dwValue;     // 32-bit unsigned integer
 HANDLE  hProcess;    // Generic handle (e.g., to a process, file, etc.)
 LPVOID  pMemory;     // Pointer to any memory location
 BOOL    bFlag;       // Boolean (TRUE or FALSE)
 LPCSTR  szString;    // Pointer to a constant string (ANSI)
 LPCWSTR szWideString;// Pointer to a constant wide string (Unicode)
 UINT    uValue;      // Unsigned int
 
 //=============================
 // 2. Process & Thread Management
 //=============================
 // Create a new process
 STARTUPINFO si = { sizeof(si) }; // Process startup info
 PROCESS_INFORMATION pi;
 BOOL success = CreateProcess(
     "C:\\Windows\\System32\\notepad.exe", // Application path
     NULL,  // Command-line arguments
     NULL,  // Process security attributes
     NULL,  // Thread security attributes
     FALSE, // Handle inheritance option
     0,     // Creation flags
     NULL,  // Environment variables
     NULL,  // Working directory
     &si,   // Startup info
     &pi    // Process information
 );
 
 // Wait for process to exit and clean up
 if (success) {
     WaitForSingleObject(pi.hProcess, INFINITE);
     CloseHandle(pi.hProcess);
     CloseHandle(pi.hThread);
 }
 
 //=============================
 // 3. Memory Management
 //=============================
 // Allocate memory in another process
 pMemory = VirtualAllocEx(
     hProcess,       // Handle to the target process
     NULL,           // Let the system choose the address
     1024,           // Size of memory allocation
     MEM_COMMIT | MEM_RESERVE, // Allocation type
     PAGE_EXECUTE_READWRITE // Memory protection
 );
 
 // Free allocated memory
 VirtualFreeEx(hProcess, pMemory, 0, MEM_RELEASE);
 
 //=============================
 // 4. File Management
 //=============================
 HANDLE hFile = CreateFile(
     "test.txt",        // File name
     GENERIC_WRITE,      // Access mode
     0,                 // Share mode
     NULL,              // Security attributes
     CREATE_ALWAYS,     // Creation disposition
     FILE_ATTRIBUTE_NORMAL, // File attributes
     NULL               // Template file
 );
 
 if (hFile != INVALID_HANDLE_VALUE) {
     DWORD written;
     WriteFile(hFile, "Hello, WinAPI!", 15, &written, NULL);
     CloseHandle(hFile);
 }
 
 //=============================
 // 5. Registry Operations
 //=============================
 HKEY hKey;
 RegOpenKeyEx(HKEY_CURRENT_USER, "Software\\MyApp", 0, KEY_SET_VALUE, &hKey);
 DWORD dwData = 1;
 RegSetValueEx(hKey, "MySetting", 0, REG_DWORD, (BYTE*)&dwData, sizeof(dwData));
 RegCloseKey(hKey);
 
 //=============================
 // 6. DLL Injection Example (Basic)
 //=============================
 hProcess = OpenProcess(PROCESS_ALL_ACCESS, FALSE, 1234); // Target process ID
 pMemory = VirtualAllocEx(hProcess, NULL, MAX_PATH, MEM_COMMIT, PAGE_READWRITE);
 WriteProcessMemory(hProcess, pMemory, "C:\\MyDLL.dll", strlen("C:\\MyDLL.dll"), NULL);
 HANDLE hThread = CreateRemoteThread(hProcess, NULL, 0, (LPTHREAD_START_ROUTINE)LoadLibraryA, pMemory, 0, NULL);
 CloseHandle(hThread);
 CloseHandle(hProcess);
 
 //=============================
 // 7. Network Communication (Sockets)
 //=============================
 WSADATA wsaData;
 SOCKET sock;
 struct sockaddr_in server;
 
 WSAStartup(MAKEWORD(2, 2), &wsaData);
 sock = socket(AF_INET, SOCK_STREAM, 0);
 server.sin_family = AF_INET;
 server.sin_port = htons(80);
 server.sin_addr.s_addr = inet_addr("192.168.1.1");
 connect(sock, (struct sockaddr*)&server, sizeof(server));
 
 send(sock, "GET / HTTP/1.1\r\nHost: example.com\r\n\r\n", 35, 0);
 closesocket(sock);
 WSACleanup();
 
 //=============================
 // 8. MessageBox Example
 //=============================
 MessageBox(NULL, "Hello, World!", "WinAPI Example", MB_OK);
 
 //=============================
 // 9. Keyboard Hook Example
 //=============================
 LRESULT CALLBACK KeyboardProc(int nCode, WPARAM wParam, LPARAM lParam) {
     if (nCode == HC_ACTION && wParam == WM_KEYDOWN) {
         KBDLLHOOKSTRUCT* kbStruct = (KBDLLHOOKSTRUCT*)lParam;
         printf("Key Pressed: %d\n", kbStruct->vkCode);
     }
     return CallNextHookEx(NULL, nCode, wParam, lParam);
 }
 
 HHOOK hHook = SetWindowsHookEx(WH_KEYBOARD_LL, KeyboardProc, NULL, 0);
 MSG msg;
 while (GetMessage(&msg, NULL, 0, 0)) {
     TranslateMessage(&msg);
     DispatchMessage(&msg);
 }
 UnhookWindowsHookEx(hHook);
 
 //=============================
 // 10. Commonly Used Functions (Summary)
 //=============================
 /*
  * Process Functions:
  * - CreateProcessA/W(lpApplicationName, lpCommandLine, ...)
  * - OpenProcess(dwDesiredAccess, bInheritHandle, dwProcessId)
  * - TerminateProcess(hProcess, uExitCode)
  *
  * Memory Functions:
  * - VirtualAllocEx(hProcess, lpAddress, dwSize, flAllocationType, flProtect)
  * - VirtualFreeEx(hProcess, lpAddress, dwSize, dwFreeType)
  * - WriteProcessMemory(hProcess, lpBaseAddress, lpBuffer, nSize, lpNumberOfBytesWritten)
  *
  * File Functions:
  * - CreateFileA/W(lpFileName, dwDesiredAccess, dwShareMode, lpSecurityAttributes, dwCreationDisposition, dwFlagsAndAttributes, hTemplateFile)
  * - ReadFile(hFile, lpBuffer, nNumberOfBytesToRead, lpNumberOfBytesRead, lpOverlapped)
  * - WriteFile(hFile, lpBuffer, nNumberOfBytesToWrite, lpNumberOfBytesWritten, lpOverlapped)
  * - CloseHandle(hObject)
  *
  * Network Functions:
  * - WSAStartup(wVersionRequested, lpWSAData)
  * - socket(af, type, protocol)
  * - connect(s, name, namelen)
  * - send(s, buf, len, flags)
  * - recv(s, buf, len, flags)
  * - closesocket(s)
  * - WSACleanup()
  */
 