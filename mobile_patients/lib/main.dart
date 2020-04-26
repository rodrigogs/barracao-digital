import 'package:flutter/material.dart';
import 'package:mobile_patients/screen/home_screen.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Barracão Digital',
      theme: ThemeData.light(),
      initialRoute: '/',
      routes: {'/': (context) => HomeScreen()},
    );
  }
}
