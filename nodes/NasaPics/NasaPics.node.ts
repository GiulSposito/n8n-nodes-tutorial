import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class NasaPics implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'NASA Pics',
		name: 'nasaPics',
		icon: 'file:nasapics.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get data from NASAs API',
		defaults: {
			name: 'NASA Pics',
		},
		inputs: [ NodeConnectionType.Main ],
		outputs: [ NodeConnectionType.Main ],
		credentials: [
			{
				name: 'NasaPicsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.nasa.gov',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
		// Resources and operations will go here
			{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{
							name: 'Astronomy Picture of the Day',
							value: 'astronomyPictureOfTheDay',
						},
						{
							name: 'Mars Rover Photo',
							value: 'marsRoverPhotos',
						},
					],
					default: 'astronomyPictureOfTheDay',
				},
				// Operations will go here
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: {
						show: {
							resource: [
								'astronomyPictureOfTheDay',
							],
						},
					},
					options: [
						{
							name: 'Get',
							value: 'get',
							action: 'Get the APOD',
							description: 'Get the Astronomy Picture of the day',
							routing: {
								request: {
									method: 'GET',
									url: '/planetary/apod',
								},
							},
						},
					],
					default: 'get',
				},
				{
					displayName: 'Operation',
					name: 'operation',
					type: 'options',
					noDataExpression: true,
					displayOptions: {
						show: {
							resource: [
								'marsRoverPhotos',
							],
						},
					},
					options: [
						{
							name: 'Get',
							value: 'get',
							action: 'Get mars rover photos',
							description: 'Get photos from the Mars Rover',
							routing: {
								request: {
									method: 'GET',
								},
							},
						},
					],
					default: 'get',
				},
				{
					displayName: 'Rover Name',
					description: 'Choose which Mars Rover to get a photo from',
					required: true,
					name: 'roverName',
					type: 'options',
					options: [
						{name: 'Curiosity', value: 'curiosity'},
						{name: 'Opportunity', value: 'opportunity'},
						{name: 'Perseverance', value: 'perseverance'},
						{name: 'Spirit', value: 'spirit'},
					],
					routing: {
						request: {
							url: '=/mars-photos/api/v1/rovers/{{$value}}/photos',
						},
					},
					default: 'curiosity',
					displayOptions: {
						show: {
							resource: [
								'marsRoverPhotos',
							],
						},
					},
				},
				{
					displayName: 'Date',
					description: 'Earth date',
					required: true,
					name: 'marsRoverDate',
					type: 'dateTime',
					default:'',
					displayOptions: {
						show: {
							resource: [
								'marsRoverPhotos',
							],
						},
					},
					routing: {
						request: {
							// You've already set up the URL. qs appends the value of the field as a query string
							qs: {
								earth_date: '={{ new Date($value).toISOString().substr(0,10) }}',
							},
						},
					},
				},
				// Optional/additional fields will go here
				{
					displayName: 'Additional Fields',
					name: 'additionalFields',
					type: 'collection',
					default: {},
					placeholder: 'Add Field',
					displayOptions: {
						show: {
							resource: [
								'astronomyPictureOfTheDay',
							],
							operation: [
								'get',
							],
						},
					},
					options: [
						{
							displayName: 'Date',
							name: 'apodDate',
							type: 'dateTime',
							default: '',
							routing: {
								request: {
									// You've already set up the URL. qs appends the value of the field as a query string
									qs: {
										date: '={{ new Date($value).toISOString().substr(0,10) }}',
									},
								},
							},
						},
					],
				}
		]
	};
}
