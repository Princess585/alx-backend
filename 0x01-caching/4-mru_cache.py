#!/usr/bin/python3
"""MRUCache that inherits from BaseCaching"""
from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """From BaseCaching to MRUCache"""

    def __init__(self):
        """Initializing"""
        super().__init__()
        self.order = []

    def put(self, key, item):
        """Assign self, key, item to dictionary"""
        if key is not none and item is not none:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                removed = self.order.pop()
                self.cache_data.pop(removed)
                print("DISCARD: {}".format(removed))
            self.cache_data[key] = item
            self.order.append(key)

    def get(self, key):
        """Assign self, key to dictionary"""
        if key in self.cache_data:
            self.order.remove(key)
            self.order.append(key)
            return self.cache_data.get(key)
