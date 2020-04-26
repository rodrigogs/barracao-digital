import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class HomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          backgroundColor: Colors.white70,
          title: SvgPicture.asset(
            'assets/logo.svg',
            semanticsLabel: 'Logo',
            height: 50,
          ),
          actions: <Widget>[
            IconButton(
              icon: const Icon(Icons.info_outline),
              color: Colors.orange,
              tooltip: 'Reportar problema',
              onPressed: () {},
            ),
          ],
        ),
        body: Center(
          child: Text('Hello World'),
        ));
  }
}
