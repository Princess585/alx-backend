#!/usr/bin/env python3
"""Function named index_range that takes two int args"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Returns a tuple of size two containint start and end"""
    start = (page_size * page) - page_size
    end = page_size * page
    return (start, end)
